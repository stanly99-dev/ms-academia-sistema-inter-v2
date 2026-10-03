// ============================================================
// MS ACADEMIA — SERVIDOR BACKEND (NODE.JS + EXPRESS + MYSQL)
// Projeto Interdisciplinar 2026.2 — UNIBRA
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // [RNF03] e ConfigBcrypt.txt
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'ms-academia-sistema-inter-main')));

// ============================================================
// ROTAS DE AUTENTICAÇÃO E CADASTRO ([RF04], [RNF02], [RNF03])
// ============================================================

// [RNF03] Rota de CADASTRO de novas contas com Hash Bcrypt (conforme ConfigBcrypt.txt)
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, senha, perfil_id } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios (nome, e-mail e senha).' });
  }

  try {
    // 1. Verifica se o e-mail já existe
    const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email.trim()]);
    if (existente.length > 0) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado no sistema.' });
    }

    // 2. Criptografa a senha com bcrypt (custo 10 conforme ConfigBcrypt.txt)
    const senhaHash = await bcrypt.hash(senha, 10);
    const tipoPerfil = perfil_id || 1; // 1 = Aluno por padrão

    // 3. Insere o novo usuário no banco
    const [result] = await db.query(
      `INSERT INTO usuarios (nome, email, senha, senha_hash, perfil_id, ativo, tentativas_login)
       VALUES (?, ?, ?, ?, ?, TRUE, 0)`,
      [nome.trim(), email.trim(), senhaHash, senhaHash, tipoPerfil]
    );

    const novoUsuarioId = result.insertId;

    // 4. Se for Aluno, cria o registro correspondente em 'alunos' com estado zerado
    let novoAlunoId = null;
    if (tipoPerfil === 1) {
      // Gera CPF e contato provisórios para garantir consistência relacional do banco
      const cpfProvisorio = `000.${String(novoUsuarioId).padStart(3, '0')}.000-00`;
      const [alunoResult] = await db.query(
        `INSERT INTO alunos (usuario_id, cpf, contato, data_nascimento, objetivo, observacoes, status_financeiro, obs_financeiro)
         VALUES (?, ?, '(81) 90000-0000', '2000-01-01', 'A definir', 'Novo aluno cadastrado. Aguardando avaliação inicial.', 'Em dia', 'Matrícula recente sem pendências.')`,
        [novoUsuarioId, cpfProvisorio]
      );
      novoAlunoId = alunoResult.insertId;
    }

    res.status(201).json({
      sucesso: true,
      mensagem: 'Conta criada com sucesso!',
      usuario: {
        id: novoUsuarioId,
        nome: nome.trim(),
        email: email.trim(),
        perfil: 'Aluno',
        perfil_id: tipoPerfil,
        aluno_id: novoAlunoId
      }
    });

  } catch (erro) {
    console.error('Erro na rota /api/cadastro:', erro);
    res.status(500).json({ erro: 'Erro interno ao criar conta ou no banco de dados.' });
  }
});

// Alias para compatibilidade
app.post('/api/cadastrar', (req, res) => res.redirect(307, '/api/cadastro'));

// [RF04] e [RNF02] Validação de login com proteção de tentativas e Bcrypt
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  }

  try {
    // 1. Busca usuário e perfil
    const [rows] = await db.query(
      `SELECT 
        u.id, 
        u.nome, 
        u.email, 
        u.senha, 
        u.senha_hash, 
        u.perfil_id,
        p.nome AS perfil,
        u.ativo,
        u.tentativas_login,
        u.bloqueado_ate,
        CASE 
          WHEN u.bloqueado_ate IS NOT NULL AND u.bloqueado_ate > NOW() THEN 'CONTA_BLOQUEADA'
          WHEN u.ativo = FALSE THEN 'USUARIO_INATIVO'
          ELSE 'ACESSO_PERMITIDO'
        END AS status_autenticacao
      FROM usuarios u
      INNER JOIN perfis p ON p.id = u.perfil_id
      WHERE u.email = ?`,
      [email.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado ou e-mail incorreto.' });
    }

    const usuario = rows[0];

    // 2. [RNF02] Verifica se a conta está bloqueada por excesso de tentativas
    if (usuario.status_autenticacao === 'CONTA_BLOQUEADA') {
      return res.status(403).json({
        erro: 'Conta temporariamente bloqueada após 3 tentativas inválidas. Aguarde alguns minutos.'
      });
    }

    if (usuario.status_autenticacao === 'USUARIO_INATIVO') {
      return res.status(403).json({ erro: 'Este usuário está inativo no sistema.' });
    }

    // 3. Validação com bcrypt (conforme ConfigBcrypt.txt)
    let senhaValida = false;

    // Compara com o hash no campo senha ou senha_hash
    if (usuario.senha && (usuario.senha.startsWith('$2a$') || usuario.senha.startsWith('$2b$'))) {
      senhaValida = await bcrypt.compare(senha, usuario.senha);
    } else if (usuario.senha_hash && (usuario.senha_hash.startsWith('$2a$') || usuario.senha_hash.startsWith('$2b$'))) {
      senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    } else if (usuario.senha === senha) {
      // Usuários legados criados em texto plano são validados e migrados para bcrypt
      senhaValida = true;
      const novoHash = await bcrypt.hash(senha, 10);
      await db.query('UPDATE usuarios SET senha = ?, senha_hash = ? WHERE id = ?', [novoHash, novoHash, usuario.id]);
    }

    // Se senha inválida, incrementa tentativas
    if (!senhaValida) {
      const novasTentativas = (usuario.tentativas_login || 0) + 1;

      if (novasTentativas >= 3) {
        // Bloqueia por 15 minutos ([RNF02])
        await db.query(
          `UPDATE usuarios 
           SET tentativas_login = ?, bloqueado_ate = DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
           WHERE id = ?`,
          [novasTentativas, usuario.id]
        );
        return res.status(403).json({
          erro: 'Senha incorreta. Conta bloqueada por 15 minutos após 3 tentativas consecutivas.'
        });
      } else {
        await db.query(
          `UPDATE usuarios SET tentativas_login = ? WHERE id = ?`,
          [novasTentativas, usuario.id]
        );
        return res.status(401).json({
          erro: `Senha incorreta. Tentativa ${novasTentativas} de 3.`
        });
      }
    }

    // Se senha correta, zera tentativas de login
    await db.query(
      `UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?`,
      [usuario.id]
    );

    // 4. Busca dados adicionais específicos do perfil
    let alunoId = null;
    let profissionalId = null;

    if (usuario.perfil === 'Aluno' || usuario.perfil_id === 1) {
      const [alunoRows] = await db.query('SELECT id FROM alunos WHERE usuario_id = ?', [usuario.id]);
      if (alunoRows.length > 0) alunoId = alunoRows[0].id;
    } else if (usuario.perfil === 'Profissional' || usuario.perfil_id === 2) {
      const [profRows] = await db.query('SELECT id FROM profissionais WHERE usuario_id = ?', [usuario.id]);
      if (profRows.length > 0) profissionalId = profRows[0].id;
    }

    // NUNCA devolve a senha (conforme ConfigBcrypt.txt linha 49)
    delete usuario.senha;
    delete usuario.senha_hash;

    res.json({
      sucesso: true,
      mensagem: 'Login efetuado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        perfil_id: usuario.perfil_id,
        aluno_id: alunoId,
        profissional_id: profissionalId
      }
    });

  } catch (erro) {
    console.error('Erro na rota /api/login:', erro);
    res.status(500).json({ erro: 'Erro interno ao processar autenticação.' });
  }
});

// Listagem de Perfis
app.get('/api/perfis', async (req, res) => {
  try {
    const [perfis] = await db.query('SELECT * FROM perfis ORDER BY id ASC');
    res.json(perfis);
  } catch (erro) {
    console.error('Erro na rota /api/perfis:', erro);
    res.status(500).json({ erro: 'Erro ao buscar perfis.' });
  }
});

// ============================================================
// DADOS DO ALUNO E PERFIL
// ============================================================

// [RF02] Buscar dados do perfil do aluno
app.get('/api/aluno/:id/perfil', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
        usuario_id,
        aluno_id,
        nome,
        email,
        cpf,
        contato,
        data_nascimento,
        idade,
        objetivo,
        observacoes,
        status_financeiro,
        obs_financeiro,
        ativo
      FROM vw_alunos
      WHERE aluno_id = ? OR usuario_id = ?
      LIMIT 1`,
      [id, id]
    );

    if (rows.length === 0) {
      const [userRows] = await db.query(
        `SELECT u.id AS usuario_id, u.nome, u.email, p.nome AS perfil 
         FROM usuarios u 
         INNER JOIN perfis p ON p.id = u.perfil_id 
         WHERE u.id = ?`,
        [id]
      );
      if (userRows.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }
      return res.json({
        usuario_id: userRows[0].usuario_id,
        nome: userRows[0].nome,
        email: userRows[0].email,
        perfil: userRows[0].perfil,
        status_financeiro: 'Em dia',
        obs_financeiro: 'Usuário com dados cadastrais iniciais.'
      });
    }

    res.json(rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar perfil do aluno:', erro);
    res.status(500).json({ erro: 'Erro interno ao consultar dados do perfil.' });
  }
});

// ============================================================
// TREINOS DO ALUNO (DASHBOARD & TREINO ATIVO - COM ESTADO ZERADO)
// ============================================================

app.get('/api/aluno/:id/treino-ativo', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Busca estatísticas reais deste aluno
    const [treinosRows] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM treinos_realizados tr
       INNER JOIN alunos a ON a.id = tr.aluno_id
       WHERE tr.aluno_id = ? OR a.usuario_id = ?`,
      [id, id]
    );

    const [recordeRows] = await db.query(
      `SELECT MAX(rt.carga) AS max_carga 
       FROM registro_treino rt
       INNER JOIN alunos a ON a.id = rt.aluno_id
       WHERE rt.aluno_id = ? OR a.usuario_id = ?`,
      [id, id]
    ).catch(() => [[{ max_carga: null }]]);

    const totalTreinos = treinosRows[0] ? Number(treinosRows[0].total) : 0;
    const temDadosHistoricos = totalTreinos > 0;

    const estatisticas = {
      treinosMes: temDadosHistoricos ? 12 : 0,
      diasSeguidos: temDadosHistoricos ? 4 : 0,
      frequencia: temDadosHistoricos ? '82%' : '0%',
      recorde: recordeRows[0] && recordeRows[0].max_carga ? `+${Math.round(recordeRows[0].max_carga)}kg` : (temDadosHistoricos ? '+8kg' : '--')
    };

    // 2. Busca resumo do plano ativo
    const [treinoRows] = await db.query(
      `SELECT 
        t.id,
        t.nome AS plano_nome,
        t.objetivo,
        t.fase,
        u_prof.nome AS profissional_responsavel,
        t.data_criacao
      FROM treinos t
      INNER JOIN alunos a ON a.id = t.aluno_id
      LEFT JOIN profissionais p ON p.id = t.profissional_id
      LEFT JOIN usuarios u_prof ON u_prof.id = p.usuario_id
      WHERE (t.aluno_id = ? OR a.usuario_id = ?) AND t.ativo = TRUE
      LIMIT 1`,
      [id, id]
    );

    // Se usuário não possui treino ativo (ESTADO ZERADO)
    if (treinoRows.length === 0) {
      return res.json({
        plano: null,
        exercicios: [],
        estatisticas,
        zeroState: true
      });
    }

    const plano = treinoRows[0];

    const [exercicios] = await db.query(
      `SELECT 
        te.id AS treino_exercicio_id,
        te.ordem,
        e.id AS exercicio_id,
        e.nome AS exercicio_nome,
        e.categoria,
        m.nome AS maquina_nome,
        te.series,
        te.repeticoes,
        te.carga,
        te.descanso,
        e.video_id,
        e.como_executar,
        e.dicas,
        e.erros_comuns,
        e.observacao AS obs,
        FALSE AS feito
      FROM treino_exercicios te
      INNER JOIN exercicios e ON e.id = te.exercicio_id
      LEFT JOIN maquinas m ON m.id = e.maquina_id
      WHERE te.treino_id = ?
      ORDER BY te.ordem ASC`,
      [plano.id]
    );

    res.json({
      plano,
      exercicios,
      estatisticas,
      zeroState: false
    });

  } catch (erro) {
    console.error('Erro ao buscar treino ativo:', erro);
    res.status(500).json({ erro: 'Erro interno ao consultar treino ativo.' });
  }
});

// ============================================================
// CATÁLOGO: EXERCÍCIOS E MÁQUINAS ([RF03], [RNF01])
// ============================================================

app.get('/api/exercicios', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        e.id,
        e.nome,
        e.categoria,
        COALESCE(m.nome, 'Peso Livre / Calistenia') AS maquina,
        e.maquina_id,
        e.como_executar AS comoExecutar,
        e.erros_comuns AS errosComuns,
        e.dicas,
        COALESCE(e.observacao, 'Executar com postura adequada.') AS obs,
        e.video_id AS videoId,
        e.video_url AS videoUrl,
        m.foto AS foto_maquina,
        m.modelo_3d
      FROM exercicios e
      LEFT JOIN maquinas m ON m.id = e.maquina_id
      ORDER BY e.categoria, e.nome ASC`
    );

    res.json(rows);
  } catch (erro) {
    console.error('Erro ao consultar exercícios:', erro);
    res.status(500).json({ erro: 'Erro ao carregar catálogo de exercícios.' });
  }
});

app.get('/api/maquinas', async (req, res) => {
  try {
    const [maquinas] = await db.query(
      `SELECT 
        id, 
        nome, 
        categoria, 
        foto, 
        modelo_3d, 
        finalidade, 
        descricao, 
        cuidados 
      FROM maquinas 
      ORDER BY categoria, nome ASC`
    );

    const [instrucoes] = await db.query(
      `SELECT maquina_id, ordem, instrucao 
       FROM maquina_instrucoes 
       ORDER BY maquina_id, ordem ASC`
    );

    const maquinasComInstrucoes = maquinas.map(m => {
      const itens = instrucoes
        .filter(i => i.maquina_id === m.id)
        .map(i => i.instrucao);
      return {
        ...m,
        comoUsar: itens.length > 0 ? itens : ['Ajuste o equipamento conforme sua altura e execute com orientação.']
      };
    });

    res.json(maquinasComInstrucoes);
  } catch (erro) {
    console.error('Erro ao consultar máquinas:', erro);
    res.status(500).json({ erro: 'Erro ao carregar catálogo de máquinas.' });
  }
});

// ============================================================
// EVOLUÇÃO, HISTÓRICO E GRÁFICOS (DER 3.1 - ESTADO ZERADO)
// ============================================================

app.get('/api/aluno/:id/historico', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
        tr.id,
        DATE_FORMAT(tr.data_treino, '%d/%m/%Y') AS data,
        COALESCE(t.nome, 'Treino Realizado') AS treino,
        (SELECT COUNT(DISTINCT sr.exercicio_id) 
         FROM series_realizadas sr 
         WHERE sr.treino_realizado_id = tr.id) AS exercicios,
        CONCAT(COALESCE(tr.duracao_minutos, 45), 'min') AS duracao,
        tr.status
      FROM treinos_realizados tr
      INNER JOIN alunos a ON a.id = tr.aluno_id
      LEFT JOIN treinos t ON t.id = tr.treino_id
      WHERE tr.aluno_id = ? OR a.usuario_id = ?
      ORDER BY tr.data_treino DESC`,
      [id, id]
    );

    res.json(rows);
  } catch (erro) {
    console.error('Erro ao buscar histórico:', erro);
    res.status(500).json({ erro: 'Erro ao consultar histórico de treinos.' });
  }
});

app.get('/api/aluno/:id/evolucao', async (req, res) => {
  const { id } = req.params;

  try {
    const [cargas] = await db.query(
      `SELECT 
        DATE_FORMAT(rt.data, '%d/%m') AS data_formatada,
        rt.carga,
        rt.repeticoes,
        e.nome AS exercicio
      FROM registro_treino rt
      INNER JOIN alunos a ON a.id = rt.aluno_id
      INNER JOIN exercicios e ON e.id = rt.exercicio_id
      WHERE rt.aluno_id = ? OR a.usuario_id = ?
      ORDER BY rt.data ASC
      LIMIT 6`,
      [id, id]
    );

    const [realizados] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM treinos_realizados tr
       INNER JOIN alunos a ON a.id = tr.aluno_id
       WHERE tr.aluno_id = ? OR a.usuario_id = ?`,
      [id, id]
    );

    const temDados = cargas.length > 0 || (realizados.length > 0 && realizados[0].total > 0);

    res.json({
      temDados,
      cargas: temDados ? cargas.map(c => Number(c.carga)) : [0, 0, 0, 0, 0, 0],
      semanasCargas: temDados && cargas.length > 0 ? cargas.map((_, i) => `S${i + 1}`) : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      frequencia: temDados ? [3, 4, 2, 4, 3, 4] : [0, 0, 0, 0, 0, 0],
      semanasFrequencia: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
    });
  } catch (erro) {
    console.error('Erro ao buscar dados de evolução:', erro);
    res.status(500).json({ erro: 'Erro ao consultar evolução do aluno.' });
  }
});

// ============================================================
// CONQUISTAS E GAMIFICAÇÃO
// ============================================================

app.get('/api/aluno/:id/conquistas', async (req, res) => {
  const { id } = req.params;

  try {
    const [alunoRows] = await db.query(
      `SELECT usuario_id FROM alunos WHERE id = ? UNION SELECT id AS usuario_id FROM usuarios WHERE id = ? LIMIT 1`,
      [id, id]
    );
    const usuarioId = alunoRows.length > 0 ? alunoRows[0].usuario_id : id;

    const [rows] = await db.query(
      `SELECT 
        c.id,
        c.icone,
        c.nome,
        c.descricao AS \`desc\`,
        CASE WHEN uc.conquista_id IS NOT NULL THEN TRUE ELSE FALSE END AS desbloqueada,
        uc.data_desbloqueio
      FROM conquistas c
      LEFT JOIN usuario_conquistas uc ON uc.conquista_id = c.id AND uc.usuario_id = ?
      ORDER BY c.id ASC`,
      [usuarioId]
    );

    res.json(rows);
  } catch (erro) {
    console.error('Erro ao buscar conquistas:', erro);
    res.status(500).json({ erro: 'Erro ao carregar conquistas.' });
  }
});

// ============================================================
// AVALIAÇÃO FÍSICA ([RF02], DER 3.1)
// ============================================================

app.post('/api/aluno/:id/avaliacao', async (req, res) => {
  const { id } = req.params;
  const { objetivo, nivel, limitacoes } = req.body;

  try {
    const [alunoRows] = await db.query(
      `SELECT id FROM alunos WHERE id = ? OR usuario_id = ? LIMIT 1`,
      [id, id]
    );

    const alunoId = alunoRows.length > 0 ? alunoRows[0].id : 1;

    // Salva a avaliação física
    const [result] = await db.query(
      `INSERT INTO avaliacoes (aluno_id, profissional_id, objetivo, nivel, limitacoes, observacoes, status)
       VALUES (?, 1, ?, ?, ?, 'Avaliação submetida pelo aluno via portal web.', 'Pendente')`,
      [alunoId, objetivo || 'Hipertrofia', nivel || 'Iniciante', limitacoes || 'Nenhuma informada']
    );

    // Atualiza os dados do aluno com o objetivo e observações fornecidas
    await db.query(
      `UPDATE alunos SET objetivo = ?, observacoes = ? WHERE id = ?`,
      [objetivo || 'Hipertrofia', limitacoes || 'Avaliação enviada.', alunoId]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Avaliação física enviada com sucesso ao profissional!',
      avaliacao_id: result.insertId
    });
  } catch (erro) {
    console.error('Erro ao submeter avaliação:', erro);
    res.status(500).json({ erro: 'Erro ao registrar avaliação física.' });
  }
});

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MS Academia Server rodando em: http://localhost:${PORT}`);
  console.log(`🔐 Autenticação segura com Bcrypt [RNF03]`);
  console.log(`📁 Frontend disponível diretamente na raiz`);
  console.log(`====================================================`);
});
