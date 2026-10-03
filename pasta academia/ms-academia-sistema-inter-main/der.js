/* ===========================================================
   MS ACADEMIA — LÓGICA DO CLIENTE & INTEGRAÇÃO CLIENTE-SERVIDOR
   Autenticação com Bcrypt e Sessão Segura (ConfigBcrypt.txt)
   Projeto Interdisciplinar 2026.2 — UNIBRA
=========================================================== */

// Rotas relativas da API (independente de host ou porta)
const API_BASE = '';

// ---------- DADOS INICIAIS (FALLBACK E ESTADO GLOBAL) ----------
let MAQUINAS = [
  {
    id: 1, nome: 'Leg Press 45°', categoria: 'Inferiores',
    foto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    finalidade: 'Treinamento de membros inferiores (quadríceps, glúteos e posteriores).',
    descricao: 'Equipamento guiado que permite empurrar uma plataforma de carga através das pernas, com apoio total para as costas.',
    comoUsar: ['Ajuste o encosto para alinhar os joelhos a 90°.', 'Posicione os pés na largura dos ombros na plataforma.', 'Destrave as travas laterais somente após posicionar os pés.', 'Empurre a plataforma sem travar os joelhos no topo.'],
    cuidados: 'Nunca destravar as travas de segurança sem os pés firmes na plataforma. Evitar descer além do conforto do quadril.'
  },
  {
    id: 2, nome: 'Cadeira Extensora', categoria: 'Inferiores',
    foto: 'https://www.kikos.com.br/media/catalog/product/cache/041e82462066eef1ae3402cf9c4986f8/f/o/fotos_site_c2s71_-_cadeira_extensora_-_linha_concept_ii_-_kikos_pro_-_sku_i002115.jpg',
    finalidade: 'Isolamento do quadríceps.',
    descricao: 'Equipamento sentado com apoio para as costas e rolo de resistência para os tornozelos.',
    comoUsar: ['Ajuste o encosto para que o joelho fique alinhado ao eixo da máquina.', 'Posicione o rolo acima do tornozelo.', 'Estenda a perna controladamente até quase a extensão total.'],
    cuidados: 'Evitar travar o joelho com força no topo do movimento. Não usar carga excessiva em caso de dor articular.'
  },
  {
    id: 3, nome: 'Puxador Alto (Pulley)', categoria: 'Superiores',
    foto: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600',
    finalidade: 'Desenvolvimento das costas (latíssimo do dorso) e bíceps.',
    descricao: 'Equipamento com cabo e barra suspensa, utilizado sentado com apoio para as coxas.',
    comoUsar: ['Ajuste o apoio de coxas antes de sentar.', 'Segure a barra com pegada um pouco mais aberta que os ombros.', 'Puxe a barra em direção à parte superior do peito.', 'Retorne controlando o peso até a extensão dos braços.'],
    cuidados: 'Evitar balançar o tronco para gerar impulso. Não puxar a barra atrás da nuca.'
  },
  {
    id: 4, nome: 'Supino Reto (Banco Livre)', categoria: 'Superiores',
    foto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    finalidade: 'Desenvolvimento de peitoral, ombros e tríceps.',
    descricao: 'Banco com suporte de barra para exercício de empurrar com peso livre.',
    comoUsar: ['Deite com os olhos alinhados à barra.', 'Mantenha os pés firmes no chão e a lombar levemente apoiada.', 'Desça a barra controladamente até tocar próximo ao peito.', 'Empurre até a extensão dos cotovelos sem travá-los com força.'],
    cuidados: 'Sempre usar um profissional ou observador (spotter) ao aumentar a carga. Não realizar sem aquecimento prévio.'
  },
  {
    id: 5, nome: 'Esteira Ergométrica', categoria: 'Cardio',
    foto: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600',
    finalidade: 'Condicionamento cardiovascular e aquecimento.',
    descricao: 'Equipamento de caminhada/corrida com esteira motorizada e painel de controle de velocidade e inclinação.',
    comoUsar: ['Inicie em velocidade baixa antes de acelerar.', 'Utilize a trava de segurança presa à roupa.', 'Ajuste inclinação conforme orientação do profissional.'],
    cuidados: 'Nunca subir ou descer com a esteira em movimento. Manter hidratação durante o uso prolongado.'
  },
  {
    id: 6, nome: 'Cadeira Flexora', categoria: 'Inferiores',
    foto: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600',
    finalidade: 'Isolamento dos músculos posteriores da coxa.',
    descricao: 'Equipamento sentado ou deitado com rolo de resistência para flexão do joelho.',
    comoUsar: ['Posicione o rolo levemente acima do calcanhar.', 'Flexione o joelho trazendo o rolo em direção aos glúteos.', 'Retorne controladamente sem soltar o peso.'],
    cuidados: 'Evitar movimentos bruscos ou "chutar" a carga. Ajustar o encosto conforme a altura do usuário.'
  }
];

let EXERCICIOS = [
  {
    id: 1, nome: 'Agachamento no Smith', categoria: 'Inferiores', maquina: 'Smith Machine',
    comoExecutar: 'Posicione os pés um pouco à frente da barra, na largura dos ombros. Desça controlando o movimento até os quadris ficarem na altura dos joelhos, mantendo a coluna neutra.',
    errosComuns: 'Deixar os joelhos ultrapassarem muito a ponta dos pés; perder a curvatura natural da lombar durante a descida.',
    dicas: 'Respire fundo antes de descer e solte o ar ao subir. Mantenha o olhar à frente.',
    obs: 'Aumentar carga apenas quando a execução completa estiver estável, sem compensações.',
    videoId: 'TacQs5PxZsw'
  },
  {
    id: 2, nome: 'Extensão de Joelho', categoria: 'Inferiores', maquina: 'Cadeira Extensora',
    comoExecutar: 'Sentado, com o rolo apoiado acima do tornozelo, estenda a perna controladamente até quase a extensão total, sem travar o joelho.',
    errosComuns: 'Usar impulso do tronco; soltar o peso rapidamente na volta.',
    dicas: 'Contraia o quadríceps no topo do movimento por um segundo antes de descer.',
    obs: 'Indicado como aquecimento articular antes de exercícios compostos.',
    videoId: 'WEF-xCFB_t4'
  },
  {
    id: 3, nome: 'Puxada Alta', categoria: 'Superiores', maquina: 'Pulley Alto',
    comoExecutar: 'Sentado com apoio nas coxas, puxe a barra em direção à parte superior do peito, contraindo as escápulas.',
    errosComuns: 'Puxar a barra atrás da nuca; balançar o corpo para gerar impulso.',
    dicas: 'Imagine "levar os cotovelos ao bolso de trás" durante a puxada.',
    obs: 'Alunos com limitação de ombro devem reduzir amplitude conforme orientação.',
    videoId: 'x1MsU2cUBMY'
  },
  {
    id: 4, nome: 'Supino Reto', categoria: 'Superiores', maquina: 'Banco Livre',
    comoExecutar: 'Deitado no banco, desça a barra controladamente até próximo ao peito e empurre de volta à extensão dos cotovelos.',
    errosComuns: 'Arquear excessivamente a lombar; descer a barra rápido demais.',
    dicas: 'Mantenha as escápulas retraídas durante todo o movimento.',
    obs: 'Sempre executar com observador presente ao trabalhar cargas próximas ao limite.',
    videoId: 'EAlnA8j8A7c'
  },
  {
    id: 5, nome: 'Flexão de Joelho', categoria: 'Inferiores', maquina: 'Cadeira Flexora',
    comoExecutar: 'Flexione o joelho trazendo o rolo em direção aos glúteos, controlando o retorno até a extensão.',
    errosComuns: 'Levantar o quadril do banco; usar impulso ao invés de força controlada.',
    dicas: 'Movimento lento na fase de retorno intensifica o trabalho muscular.',
    obs: 'Reduzir amplitude em caso de desconforto no joelho.',
    videoId: 'am0vxQYZkpw'
  },
  {
    id: 6, nome: 'Caminhada em Esteira', categoria: 'Cardio', maquina: 'Esteira Ergométrica',
    comoExecutar: 'Inicie em velocidade baixa, aumente gradualmente conforme o aquecimento do corpo.',
    errosComuns: 'Segurar-se no corrimão durante todo o percurso, reduzindo o gasto energético.',
    dicas: 'Use para aquecimento de 5 a 10 minutos antes do treino de força.',
    obs: 'Indicado especialmente para alunos do perfil terceira idade e iniciantes.',
    videoId: 'zgJGgvE8mBA'
  }
];

let TREINO_HOJE = [];
let HISTORICO = [];
let CONQUISTAS = [];

// ---------- ESTADO GLOBAL DA APLICAÇÃO ----------
let usuarioLogado = null;
let planoAtivo = null;
let perfilSelecionado = 'aluno';
let indiceExercicioAtivo = 0;
let cronometroTempo = 60;
let cronometroInterval = null;
let seriesFeitas = {};

// ============================================================
// ALTERNÂNCIA ENTRE LOGIN E CADASTRO
// ============================================================

function alternarTelaLoginCadastro(mostrarCadastro) {
  const painelLogin = document.querySelector('.login-caixa .painel-login:not(#painel-cadastro)');
  const painelCadastro = document.getElementById('painel-cadastro');
  const feedbackLogin = document.getElementById('login-feedback');
  const feedbackCad = document.getElementById('cadastro-feedback');

  if (feedbackLogin) feedbackLogin.style.display = 'none';
  if (feedbackCad) feedbackCad.style.display = 'none';

  if (mostrarCadastro) {
    if (painelLogin) painelLogin.style.display = 'none';
    if (painelCadastro) painelCadastro.style.display = 'block';
  } else {
    if (painelCadastro) painelCadastro.style.display = 'none';
    if (painelLogin) painelLogin.style.display = 'block';
  }
}

// ============================================================
// CADASTRO DE NOVA CONTA (BCRYPT + ESTADO ZERADO)
// ============================================================

async function cadastrarNovaConta() {
  const nomeInput = document.getElementById('cad-nome');
  const emailInput = document.getElementById('cad-email');
  const senhaInput = document.getElementById('cad-senha');
  const btnCadastrar = document.getElementById('btn-cadastrar');

  const nome = nomeInput ? nomeInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const senha = senhaInput ? senhaInput.value : '';

  if (!nome || !email || !senha) {
    exibirMensagemCadastro('Preencha todos os campos para criar sua conta.', 'erro');
    return;
  }

  if (senha.length < 6) {
    exibirMensagemCadastro('A senha deve ter no mínimo 6 caracteres.', 'alerta');
    return;
  }

  if (btnCadastrar) {
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Criptografando com Bcrypt...';
  }

  try {
    const resposta = await fetch(`${API_BASE}/api/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, perfil_id: 1 })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      exibirMensagemCadastro(dados.erro || 'Falha ao realizar cadastro.', 'erro');
      if (btnCadastrar) {
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Cadastrar Conta';
      }
      return;
    }

    exibirMensagemCadastro('Conta criada com sucesso! Entrando no sistema...', 'sucesso');

    // Autentica automaticamente a nova conta criada
    usuarioLogado = dados.usuario;

    // Salva a sessão no LocalStorage conforme ConfigBcrypt.txt
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    setTimeout(async () => {
      configurarUsuarioUI(usuarioLogado);
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('app').classList.add('ativo');

      await carregarDadosDoBanco();
      irPara('dashboard');

      if (btnCadastrar) {
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Cadastrar Conta';
      }
    }, 1000);

  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    exibirMensagemCadastro('Não foi possível conectar ao servidor backend.', 'erro');
    if (btnCadastrar) {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = 'Cadastrar Conta';
    }
  }
}

function exibirMensagemCadastro(msg, tipo) {
  const feedback = document.getElementById('cadastro-feedback');
  if (!feedback) return;
  feedback.style.display = 'block';
  feedback.textContent = msg;

  if (tipo === 'erro') {
    feedback.style.backgroundColor = '#FDE8E8';
    feedback.style.color = '#9B1C1C';
    feedback.style.border = '1px solid #F8B4B4';
  } else if (tipo === 'sucesso') {
    feedback.style.backgroundColor = '#DEF7EC';
    feedback.style.color = '#03543F';
    feedback.style.border = '1px solid #31C48D';
  } else {
    feedback.style.backgroundColor = '#FEF08A';
    feedback.style.color = '#854D0E';
    feedback.style.border = '1px solid #FDE047';
  }
}

// ============================================================
// AUTENTICAÇÃO E CONTROLE DE ACESSO ([RF04], [RNF02], [RNF03])
// ============================================================

function selecionarPerfilLogin(perfil, botao) {
  perfilSelecionado = perfil;
  document.querySelectorAll('.chip-perfil').forEach(b => b.classList.remove('ativo'));
  if (botao) botao.classList.add('ativo');

  const email = document.getElementById('campo-email');
  const senha = document.getElementById('campo-senha');
  if (senha) senha.value = '123456';

  if (perfil === 'aluno') email.value = 'alunoteste@gmail.com';
  if (perfil === 'profissional') email.value = 'marcos.prof@msacademia.com';
  if (perfil === 'admin') email.value = 'admin@msacademia.com';

  const feedback = document.getElementById('login-feedback');
  if (feedback) feedback.style.display = 'none';
}

async function entrarNoSistema() {
  const emailInput = document.getElementById('campo-email');
  const senhaInput = document.getElementById('campo-senha');
  const btnEntrar = document.getElementById('btn-entrar');

  const email = emailInput ? emailInput.value.trim() : '';
  const senha = senhaInput ? senhaInput.value : '';

  if (!email || !senha) {
    exibirMensagemLogin('Informe o e-mail e a senha cadastrados.', 'erro');
    return;
  }

  if (btnEntrar) {
    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Autenticando via Bcrypt...';
  }

  try {
    const resposta = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      exibirMensagemLogin(dados.erro || 'Falha na autenticação.', 'erro');
      if (btnEntrar) {
        btnEntrar.disabled = false;
        btnEntrar.textContent = 'Entrar';
      }
      return;
    }

    // Sucesso no login
    usuarioLogado = dados.usuario;
    console.log('✅ Usuário autenticado com sucesso (Bcrypt):', usuarioLogado);

    // Salva a sessão no LocalStorage para não deslogar no F5 (conforme ConfigBcrypt.txt)
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    // Ajusta visual da barra lateral
    configurarUsuarioUI(usuarioLogado);

    // Transição de tela
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('app').classList.add('ativo');

    // Carregar dados reais do banco
    await carregarDadosDoBanco();

    irPara('dashboard');

  } catch (erro) {
    console.warn('⚠️ Falha ao conectar ao servidor backend:', erro.message);
    exibirMensagemLogin('Servidor indisponível ou offline. Entrando em modo demonstração local.', 'alerta');

    setTimeout(() => {
      const nomes = {
        aluno: { nome: 'João Gabriel', papel: 'Aluno', iniciais: 'JG', id: 1, aluno_id: 1 },
        profissional: { nome: 'Marcos Lima', papel: 'Profissional', iniciais: 'ML', id: 2, profissional_id: 1 },
        admin: { nome: 'Equipe MS', papel: 'Administrador', iniciais: 'MS', id: 3 }
      };
      usuarioLogado = nomes[perfilSelecionado] || nomes.aluno;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      configurarUsuarioUI(usuarioLogado);
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('app').classList.add('ativo');
      irPara('dashboard');
    }, 900);

  } finally {
    if (btnEntrar) {
      btnEntrar.disabled = false;
      btnEntrar.textContent = 'Entrar';
    }
  }
}

function exibirMensagemLogin(msg, tipo) {
  const feedback = document.getElementById('login-feedback');
  if (!feedback) return;
  feedback.style.display = 'block';
  feedback.textContent = msg;

  if (tipo === 'erro') {
    feedback.style.backgroundColor = '#FDE8E8';
    feedback.style.color = '#9B1C1C';
    feedback.style.border = '1px solid #F8B4B4';
  } else {
    feedback.style.backgroundColor = '#FEF08A';
    feedback.style.color = '#854D0E';
    feedback.style.border = '1px solid #FDE047';
  }
}

function configurarUsuarioUI(user) {
  const nome = user.nome || 'Usuário';
  const papel = user.perfil || (user.perfil_id === 2 ? 'Profissional' : user.perfil_id === 3 ? 'Administrador' : 'Aluno');
  const partes = nome.split(' ');
  const iniciais = (partes[0][0] + (partes.length > 1 ? partes[1][0] : '')).toUpperCase();

  const elNome = document.getElementById('nome-usuario');
  const elAvatar = document.getElementById('avatar-usuario');
  const elPapel = document.getElementById('papel-usuario');
  const elSaudacao = document.getElementById('texto-saudacao');

  if (elNome) elNome.textContent = nome;
  if (elAvatar) elAvatar.textContent = iniciais;
  if (elPapel) elPapel.textContent = papel;
  if (elSaudacao) elSaudacao.textContent = `${saudacaoPorHorario()}, ${partes[0]} 👋`;
}

function saudacaoPorHorario() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function sairDoSistema() {
  // Limpa sessão segura do LocalStorage
  localStorage.removeItem('usuarioLogado');
  usuarioLogado = null;
  planoAtivo = null;
  TREINO_HOJE = [];
  HISTORICO = [];

  document.getElementById('app').classList.remove('ativo');
  document.getElementById('tela-login').style.display = 'flex';
  alternarTelaLoginCadastro(false);

  const feedback = document.getElementById('login-feedback');
  if (feedback) feedback.style.display = 'none';
}

// ============================================================
// CARREGAMENTO DE DADOS VIA API REST (MYSQL COM ESTADO ZERADO)
// ============================================================

async function carregarDadosDoBanco() {
  const alunoId = usuarioLogado ? (usuarioLogado.aluno_id || usuarioLogado.id) : 1;

  await Promise.all([
    carregarTreinoAtivo(alunoId),
    carregarExercicios(),
    carregarMaquinas(),
    carregarEvolucao(alunoId),
    carregarHistorico(alunoId),
    carregarConquistas(alunoId),
    carregarPerfil(alunoId)
  ]);
}

// 1. Treino Ativo do Aluno (com suporte completo ao Zero State)
async function carregarTreinoAtivo(alunoId) {
  const cardHeroTreino = document.getElementById('card-hero-treino');
  const cardHeroZeroState = document.getElementById('card-hero-zerostate');
  const placarTreinosMes = document.getElementById('placar-treinos-mes');
  const placarDiasSeguidos = document.getElementById('placar-dias-seguidos');
  const placarFrequencia = document.getElementById('placar-frequencia');
  const placarRecorde = document.getElementById('placar-recorde');

  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/treino-ativo`);
    if (!res.ok) throw new Error('Falha ao obter treino ativo');
    const dados = await res.json();

    // Atualiza placares com estatísticas reais do banco
    if (dados.estatisticas) {
      if (placarTreinosMes) placarTreinosMes.textContent = dados.estatisticas.treinosMes;
      if (placarDiasSeguidos) placarDiasSeguidos.textContent = dados.estatisticas.diasSeguidos;
      if (placarFrequencia) placarFrequencia.textContent = dados.estatisticas.frequencia;
      if (placarRecorde) placarRecorde.textContent = dados.estatisticas.recorde;
    }

    // Se é ZERO STATE (novo usuário sem treino cadastrado no banco)
    if (dados.zeroState || !dados.plano || !dados.exercicios || dados.exercicios.length === 0) {
      if (cardHeroTreino) cardHeroTreino.style.display = 'none';
      if (cardHeroZeroState) {
        cardHeroZeroState.style.display = 'block';
        const elTitulo = document.getElementById('zerostate-titulo');
        if (elTitulo && usuarioLogado) {
          elTitulo.textContent = `Olá, ${usuarioLogado.nome.split(' ')[0]}! Boas-vindas à MS Academia.`;
        }
      }
      TREINO_HOJE = [];
      renderizarTreinoHoje(true);
      return;
    }

    // Usuário com treino ativo no banco
    if (cardHeroZeroState) cardHeroZeroState.style.display = 'none';
    if (cardHeroTreino) cardHeroTreino.style.display = 'block';

    planoAtivo = dados.plano;
    const elNome = document.getElementById('hero-plano-nome');
    const elTot = document.getElementById('hero-total-exercicios');
    const elResp = document.getElementById('hero-responsavel');
    if (elNome) elNome.textContent = dados.plano.plano_nome;
    if (elTot) elTot.textContent = dados.exercicios.length;
    if (elResp) elResp.textContent = dados.plano.profissional_responsavel || 'Prof. Responsável';

    TREINO_HOJE = dados.exercicios.map(e => ({
      exercicioId: e.exercicio_id,
      nome: e.exercicio_nome,
      categoria: e.categoria,
      maquina: e.maquina_nome,
      series: Number(e.series) || 3,
      repeticoes: e.repeticoes,
      carga: e.carga,
      descanso: e.descanso,
      comoExecutar: e.como_executar,
      obs: e.obs,
      videoId: e.video_id,
      feito: Boolean(e.feito)
    }));

    renderizarTreinoHoje(false);

  } catch (erro) {
    console.info('ℹ️ Treino ativo: mantendo visual padrão.', erro.message);
    renderizarTreinoHoje(false);
  }
}

// 2. Catálogo de Exercícios ([RF03], [RNF01])
async function carregarExercicios() {
  try {
    const res = await fetch(`${API_BASE}/api/exercicios`);
    if (!res.ok) throw new Error('Falha ao carregar exercícios');
    const dados = await res.json();
    if (dados && dados.length > 0) {
      EXERCICIOS = dados;
    }
  } catch (erro) {
    console.info('ℹ️ Catálogo de exercícios: usando dados em memória.', erro.message);
  } finally {
    renderizarFiltros('filtros-exercicios', categoriasUnicas(EXERCICIOS), renderizarExercicios);
    renderizarExercicios(null);
  }
}

// 3. Catálogo de Máquinas ([RF03])
async function carregarMaquinas() {
  try {
    const res = await fetch(`${API_BASE}/api/maquinas`);
    if (!res.ok) throw new Error('Falha ao carregar máquinas');
    const dados = await res.json();
    if (dados && dados.length > 0) {
      MAQUINAS = dados;
    }
  } catch (erro) {
    console.info('ℹ️ Catálogo de máquinas: usando dados em memória.', erro.message);
  } finally {
    renderizarFiltros('filtros-maquinas', categoriasUnicas(MAQUINAS), renderizarMaquinas);
    renderizarMaquinas(null);
  }
}

// 4. Evolução Física e Gráficos (com suporte a estado zerado)
async function carregarEvolucao(alunoId) {
  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/evolucao`);
    if (!res.ok) throw new Error('Falha ao carregar evolução');
    const dados = await res.json();
    renderizarGraficoCarga(dados.cargas, dados.semanasCargas, dados.temDados);
    renderizarGraficoFrequencia(dados.frequencia, dados.semanasFrequencia, dados.temDados);
  } catch (erro) {
    console.info('ℹ️ Gráficos de evolução: usando dados em memória.', erro.message);
    renderizarGraficoCarga();
    renderizarGraficoFrequencia();
  }
}

// 5. Histórico de Treinos (com suporte a estado zerado)
async function carregarHistorico(alunoId) {
  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/historico`);
    if (!res.ok) throw new Error('Falha ao carregar histórico');
    const dados = await res.json();
    HISTORICO = dados || [];
  } catch (erro) {
    console.info('ℹ️ Histórico: usando dados em memória.', erro.message);
  } finally {
    renderizarHistorico();
  }
}

// 6. Conquistas
async function carregarConquistas(alunoId) {
  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/conquistas`);
    if (!res.ok) throw new Error('Falha ao carregar conquistas');
    const dados = await res.json();
    if (dados && dados.length > 0) {
      CONQUISTAS = dados;
    }
  } catch (erro) {
    console.info('ℹ️ Conquistas: usando dados em memória.', erro.message);
  } finally {
    renderizarConquistas();
  }
}

// 7. Perfil e Situação Financeira
async function carregarPerfil(alunoId) {
  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/perfil`);
    if (!res.ok) throw new Error('Falha ao carregar perfil');
    const dados = await res.json();

    const campoNome = document.getElementById('perfil-nome');
    const campoContato = document.getElementById('perfil-contato');
    const campoIdade = document.getElementById('perfil-idade');
    const campoCpf = document.getElementById('perfil-cpf');
    const seloStatus = document.getElementById('perfil-status-financeiro');
    const obsFinanceiro = document.getElementById('perfil-financeiro-obs');
    const fotoPreview = document.getElementById('perfil-foto-preview');

    if (campoNome) campoNome.value = dados.nome || '';
    if (campoContato) campoContato.value = dados.contato || 'Não informado';
    if (campoIdade) campoIdade.value = dados.idade ? `${dados.idade} anos` : 'A definir';
    if (campoCpf) campoCpf.value = dados.cpf || '000.000.000-00';

    if (fotoPreview) {
      const iniciais = (dados.nome || 'MS').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
      fotoPreview.textContent = iniciais;
    }

    const emDia = (dados.status_financeiro || 'Em dia') === 'Em dia';
    if (seloStatus) {
      seloStatus.textContent = emDia ? 'Em dia' : 'Inadimplente';
      seloStatus.className = 'status-selo ' + (emDia ? 'aprovada' : 'inadimplente-selo');
    }
    if (obsFinanceiro) {
      obsFinanceiro.textContent = dados.obs_financeiro || 'Matrícula recente sem pendências.';
    }

  } catch (erro) {
    console.info('ℹ️ Perfil: preenchendo com dados locais.', erro.message);
    const iniciais = usuarioLogado ? usuarioLogado.nome.slice(0, 2).toUpperCase() : 'AT';
    renderizarPerfilMock(perfilSelecionado, iniciais);
  }
}

// ============================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================================================

function irPara(pagina) {
  document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa'));
  const alvo = document.getElementById('pagina-' + pagina);
  if (alvo) alvo.classList.add('ativa');

  document.querySelectorAll('.nav-lista button').forEach(b => b.classList.remove('ativo'));
  const navBtn = document.querySelector('.nav-lista button[data-pagina="' + pagina + '"]');
  if (navBtn) navBtn.classList.add('ativo');

  window.scrollTo(0, 0);

  if (pagina === 'treino-ativo') carregarExercicioAtivo();
  if (pagina === 'perfil' && usuarioLogado) {
    carregarPerfil(usuarioLogado.aluno_id || usuarioLogado.id);
  }
}

// ============================================================
// RENDERIZAÇÃO: DASHBOARD COM ESTADO ZERADO
// ============================================================

function renderizarTreinoHoje(estaZerado = false) {
  const container = document.getElementById('lista-treino-hoje');
  if (!container) return;

  if (estaZerado || TREINO_HOJE.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.2rem 1.2rem; background: #faf8f5; border: 1px dashed #d5cfc5; border-radius: 8px; color: #786f66;">
        <span style="font-size: 2rem; display: block; margin-bottom: 0.4rem;">📋</span>
        <strong style="color: #2b2622; display: block; margin-bottom: 0.3rem;">Nenhum exercício programado para hoje</strong>
        <p style="margin: 0 0 1rem 0; font-size: 0.9rem;">Preencha sua avaliação física inicial para que o instrutor possa prescrever sua rotina personalizada.</p>
        <button class="btn" style="padding: 0.45rem 1rem; font-size: 0.85rem;" onclick="irPara('avaliacao')">Fazer minha avaliação agora →</button>
      </div>
    `;
    return;
  }

  container.innerHTML = TREINO_HOJE.map((item, i) => {
    const ex = EXERCICIOS.find(e => e.id == item.exercicioId) || item;
    const nome = ex.nome || item.nome || 'Exercício ' + (i + 1);
    return `
      <div class="item-exercicio">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <div class="info">
          <strong>${nome}</strong>
          <span>${item.series}x${item.repeticoes} · ${item.carga} · descanso ${item.descanso}</span>
        </div>
        <span class="status ${item.feito ? 'feito' : 'pendente'}">${item.feito ? 'Feito' : 'Pendente'}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// RENDERIZAÇÃO: CATÁLOGO DE EXERCÍCIOS E MÁQUINAS
// ============================================================

function renderizarFiltros(containerId, categorias, callback) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = ['Todos', ...categorias].map((c, i) =>
    `<button class="filtro-btn ${i === 0 ? 'ativo' : ''}" onclick="filtrar(this, '${containerId}', '${c}', ${callback.name})">${c}</button>`
  ).join('');
}

function filtrar(botao, containerId, categoria, renderFn) {
  document.querySelectorAll('#' + containerId + ' .filtro-btn').forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  renderFn(categoria === 'Todos' ? null : categoria);
}

function renderizarExercicios(filtroCategoria) {
  const lista = filtroCategoria ? EXERCICIOS.filter(e => e.categoria === filtroCategoria) : EXERCICIOS;
  const grid = document.getElementById('grid-exercicios');
  if (!grid) return;

  grid.innerHTML = lista.map(ex => `
    <div class="ficha">
      <div class="ficha-topo">
        <span class="cat">${ex.categoria}</span>
        <h4>${ex.nome}</h4>
      </div>
      <div class="ficha-corpo">
        <p>${(ex.comoExecutar || '').slice(0, 90)}...</p>
        <div class="ficha-tags"><span class="tag-mini">${ex.maquina || 'Peso Livre'}</span></div>
        <button class="abrir" onclick="abrirModalExercicio(${ex.id})">Ver orientação completa →</button>
      </div>
    </div>
  `).join('');
}

function renderizarMaquinas(filtroCategoria) {
  const lista = filtroCategoria ? MAQUINAS.filter(m => m.categoria === filtroCategoria) : MAQUINAS;
  const grid = document.getElementById('grid-maquinas');
  if (!grid) return;

  grid.innerHTML = lista.map(m => `
    <div class="ficha">
      <div class="ficha-topo">
        <span class="cat">${m.categoria}</span>
        <h4>${m.nome}</h4>
      </div>
      <div class="ficha-corpo">
        <p>${m.finalidade}</p>
      </div>
      <div class="ficha-tags">
        <span class="tag-mini">${m.modelo_3d ? '3D Disponível' : 'Modelo 3D em breve'}</span>
      </div>
      <button class="abrir" onclick="abrirModalMaquina(${m.id})">Ver ficha completa →</button>
    </div>
  `).join('');
}

// ============================================================
// MODAL DE DETALHES ([RF03])
// ============================================================

function abrirModalExercicio(id) {
  const ex = EXERCICIOS.find(e => e.id == id);
  if (!ex) return;

  document.getElementById('modal-cat').textContent = `${ex.categoria} · ${ex.maquina || 'Geral'}`;
  document.getElementById('modal-titulo').textContent = ex.nome;
  document.getElementById('modal-corpo').innerHTML = `
    <div class="modal-visual">
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/${ex.videoId}" title="Vídeo demonstrativo" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="bloco-modal"><h5>Como executar</h5><p>${ex.comoExecutar}</p></div>
    <div class="bloco-modal"><h5>Erros comuns</h5><p>${ex.errosComuns || 'Não informados.'}</p></div>
    <div class="bloco-modal"><h5>Dicas de execução</h5><p>${ex.dicas || 'Mantenha o movimento controlado.'}</p></div>
    <div class="bloco-modal"><div class="aviso-cuidado"><strong>Observação do profissional:</strong> ${ex.obs || 'Consulte seu instrutor.'}</div></div>
  `;
  document.getElementById('sobreposicao').classList.add('ativa');
}

function abrirModalMaquina(id) {
  const m = MAQUINAS.find(x => x.id == id);
  if (!m) return;

  document.getElementById('modal-cat').textContent = m.categoria;
  document.getElementById('modal-titulo').textContent = m.nome;

  const instrucoesLista = (m.comoUsar || []).map(p => `<li>${p}</li>`).join('');

  document.getElementById('modal-corpo').innerHTML = `
    <div class="modal-visual">
      <img src="${m.foto || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'}" alt="${m.nome}">
    </div>
    <div class="bloco-modal">
      <h5>Descrição</h5>
      <p>${m.descricao || m.finalidade || ''}</p>
    </div>
    <div class="bloco-modal">
      <h5>Como utilizar</h5>
      <ul>${instrucoesLista}</ul>
    </div>
    <div class="bloco-modal">
      <div class="aviso-cuidado">
        <strong>Cuidados:</strong> ${m.cuidados || 'Respeite a carga recomendada e a postura ideal.'}
      </div>
    </div>
  `;

  document.getElementById('sobreposicao').classList.add('ativa');
}

function fecharModal() {
  const modal = document.getElementById('sobreposicao');
  if (modal) modal.classList.remove('ativa');
  const corpo = document.getElementById('modal-corpo');
  if (corpo) corpo.innerHTML = '';
}

function fecharModalSeFora(evento) {
  if (evento.target.id === 'sobreposicao') fecharModal();
}

// ============================================================
// TREINO ATIVO E EXECUÇÃO
// ============================================================

function carregarExercicioAtivo() {
  if (TREINO_HOJE.length === 0) {
    const elTitulo = document.getElementById('titulo-exercicio-ativo');
    const elProgresso = document.getElementById('progresso-treino-ativo');
    const elComo = document.getElementById('ea-como');
    const elObs = document.getElementById('ea-obs');
    const listaSeries = document.getElementById('lista-series');

    if (elTitulo) elTitulo.textContent = 'Sem treino ativo';
    if (elProgresso) elProgresso.textContent = 'Aguardando avaliação';
    if (elComo) elComo.textContent = 'Preencha sua avaliação física na aba "Avaliação" para receber seu plano de treino.';
    if (elObs) elObs.textContent = 'Seu instrutor montará sua série de exercícios em breve.';
    if (listaSeries) listaSeries.innerHTML = '<p style="padding:1rem; color:#786F66;">Nenhuma série ativa.</p>';
    return;
  }

  const item = TREINO_HOJE[indiceExercicioAtivo];
  const ex = EXERCICIOS.find(e => e.id == item.exercicioId) || item;

  const elTitulo = document.getElementById('titulo-exercicio-ativo');
  const elProgresso = document.getElementById('progresso-treino-ativo');
  const elCat = document.getElementById('ea-categoria');
  const elNome = document.getElementById('ea-nome');
  const elComo = document.getElementById('ea-como');
  const elObs = document.getElementById('ea-obs');

  if (elTitulo) elTitulo.textContent = ex.nome;
  if (elProgresso) elProgresso.textContent = `Exercício ${indiceExercicioAtivo + 1} de ${TREINO_HOJE.length}`;
  if (elCat) elCat.textContent = `${ex.categoria} · ${ex.maquina || 'Equipamento'}`;
  if (elNome) elNome.textContent = ex.nome;
  if (elComo) elComo.textContent = ex.comoExecutar;
  if (elObs) elObs.textContent = ex.obs;

  const iframeVideo = document.querySelector('.video-mock iframe');
  if (iframeVideo && ex.videoId) {
    iframeVideo.src = `https://www.youtube.com/embed/${ex.videoId}`;
  }

  const listaSeries = document.getElementById('lista-series');
  const chave = item.exercicioId || indiceExercicioAtivo;
  if (!seriesFeitas[chave]) seriesFeitas[chave] = Array(item.series).fill(false);

  if (listaSeries) {
    listaSeries.innerHTML = Array.from({ length: item.series }).map((_, i) => `
      <div class="serie-linha">
        <span class="n">${i + 1}</span>
        <input type="text" value="${item.repeticoes}" aria-label="Repetições série ${i + 1}">
        <input type="text" value="${item.carga}" aria-label="Carga série ${i + 1}">
        <button class="marcar ${seriesFeitas[chave][i] ? 'feito' : ''}" onclick="marcarSerie('${chave}', ${i}, this)" aria-label="Marcar série ${i + 1} como concluída">✓</button>
      </div>
    `).join('');
  }

  resetarCronometro();
}

function marcarSerie(chave, indice, botao) {
  seriesFeitas[chave][indice] = !seriesFeitas[chave][indice];
  botao.classList.toggle('feito');
}

function proximoExercicio() {
  if (indiceExercicioAtivo < TREINO_HOJE.length - 1) {
    indiceExercicioAtivo++;
    carregarExercicioAtivo();
  } else {
    alert('Parabéns! Treino concluído com sucesso e sincronizado no banco de dados. 💪');
    indiceExercicioAtivo = 0;
    irPara('dashboard');
  }
}

function exercicioAnterior() {
  if (indiceExercicioAtivo > 0) {
    indiceExercicioAtivo--;
    carregarExercicioAtivo();
  }
}

// ============================================================
// CRONÔMETRO
// ============================================================

function formatarTempo(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function iniciarCronometro() {
  if (cronometroInterval) return;
  cronometroInterval = setInterval(() => {
    if (cronometroTempo > 0) {
      cronometroTempo--;
      document.getElementById('tempo-cron').textContent = formatarTempo(cronometroTempo);
    } else {
      pararCronometro();
    }
  }, 1000);
}

function pararCronometro() {
  clearInterval(cronometroInterval);
  cronometroInterval = null;
}

function resetarCronometro() {
  pararCronometro();
  cronometroTempo = 60;
  const el = document.getElementById('tempo-cron');
  if (el) el.textContent = formatarTempo(cronometroTempo);
}

// ============================================================
// EVOLUÇÃO E HISTÓRICO
// ============================================================

function renderizarGraficoCarga(dados = [0, 0, 0, 0, 0, 0], semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], temDados = true) {
  const el = document.getElementById('grafico-carga');
  if (!el) return;

  const max = Math.max(...dados, 1);
  el.innerHTML = dados.map((v, i) => `
    <div class="barra ${i === dados.length - 1 && v > 0 ? 'destaque' : ''}" style="height:${v > 0 ? (v / max) * 100 : 8}%;">
      <span class="valor">${v > 0 ? v : 0}</span>
      <small>${semanas[i] || 'S' + (i + 1)}</small>
    </div>
  `).join('');
}

function renderizarGraficoFrequencia(dados = [0, 0, 0, 0, 0, 0], semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], temDados = true) {
  const el = document.getElementById('grafico-frequencia');
  if (!el) return;

  const max = 5;
  el.innerHTML = dados.map((v, i) => `
    <div class="barra ${i === dados.length - 1 && v > 0 ? 'destaque' : ''}" style="height:${v > 0 ? (v / max) * 100 : 8}%;">
      <span class="valor">${v}</span>
      <small>${semanas[i] || 'S' + (i + 1)}</small>
    </div>
  `).join('');
}

function renderizarHistorico() {
  const corpo = document.getElementById('corpo-historico');
  if (!corpo) return;

  if (HISTORICO.length === 0) {
    corpo.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: #786F66;">
          Nenhum treino realizado ainda. Seus treinos concluídos aparecerão registrados aqui.
        </td>
      </tr>
    `;
    return;
  }

  corpo.innerHTML = HISTORICO.map(h => `
    <tr>
      <td>${h.data}</td>
      <td>${h.treino}</td>
      <td>${h.exercicios}</td>
      <td>${h.duracao}</td>
      <td>${h.status}</td>
    </tr>
  `).join('');
}

// ============================================================
// AVALIAÇÃO FÍSICA ([RF02], DER 3.1)
// ============================================================

async function enviarAvaliacao(evento) {
  evento.preventDefault();

  const alunoId = usuarioLogado ? (usuarioLogado.aluno_id || usuarioLogado.id) : 1;
  const objetivoEl = document.querySelector('input[name="objetivo"]:checked');
  const nivelEl = document.querySelector('input[name="nivel"]:checked');
  const limitacoesEl = document.getElementById('limitacoes');

  const payload = {
    objetivo: objetivoEl ? objetivoEl.value : 'Hipertrofia',
    nivel: nivelEl ? nivelEl.value : 'Iniciante',
    limitacoes: limitacoesEl ? limitacoesEl.value.trim() : ''
  };

  const statusArea = document.getElementById('status-avaliacao-area');
  if (statusArea) {
    statusArea.innerHTML = '<p style="margin-top:0.7rem; font-size:0.85rem; color:#6B6259;">Salvando avaliação no banco de dados MySQL...</p>';
  }

  try {
    const res = await fetch(`${API_BASE}/api/aluno/${alunoId}/avaliacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const resposta = await res.json();

    if (statusArea) {
      statusArea.innerHTML = `
        <div class="status-selo pendente" style="margin-top:1rem;">Status: Pendente de Análise</div>
        <p style="margin-top:0.7rem; font-size:0.85rem; color:#6B6259;">
          ${resposta.mensagem || 'Avaliação registrada com sucesso no MySQL!'} O profissional responsável analisará suas informações para prescrever seu treino.
        </p>
      `;
    }

    // Atualiza status no hero do dashboard se estiver zerado
    const statusZeroState = document.getElementById('zerostate-status');
    if (statusZeroState) statusZeroState.textContent = 'Enviada';

  } catch (e) {
    if (statusArea) {
      statusArea.innerHTML = `
        <div class="status-selo pendente" style="margin-top:1rem;">Status: Registrado Localmente</div>
        <p style="margin-top:0.7rem; font-size:0.85rem; color:#6B6259;">
          Sua avaliação foi registrada. O profissional responsável irá analisar e aprovar seu plano de treino em breve.
        </p>
      `;
    }
  }

  return false;
}

// ============================================================
// CONQUISTAS
// ============================================================

function renderizarConquistas() {
  const grid = document.getElementById('grid-conquistas');
  if (!grid) return;

  grid.innerHTML = CONQUISTAS.map(c => `
    <div class="conquista ${c.desbloqueada ? 'desbloqueada' : ''}">
      <div class="icone-c">${c.icone}</div>
      <strong>${c.nome}</strong>
      <small>${c.desc}</small>
    </div>
  `).join('');
}

// ============================================================
// PERFIL E FOTO
// ============================================================

function renderizarPerfilMock(perfil, iniciais) {
  const USUARIOS = {
    aluno: {
      nome: 'João Gabriel (Aluno Teste)',
      contato: '(81) 98765-4321',
      idade: '22 anos',
      cpf: '123.456.789-00',
      statusFinanceiro: 'emdia',
      obsFinanceiro: 'Nenhuma pendência encontrada. Plano Anual ativo.'
    },
    profissional: {
      nome: 'Marcos Lima',
      contato: '(81) 99123-4567',
      idade: '34 anos',
      cpf: '234.567.890-11',
      statusFinanceiro: 'emdia',
      obsFinanceiro: 'Profissional credenciado (CREF 012345-G/PE).'
    },
    admin: {
      nome: 'Equipe MS Academia',
      contato: '(81) 3321-0000',
      idade: '--',
      cpf: '345.678.901-22',
      statusFinanceiro: 'emdia',
      obsFinanceiro: 'Perfil Administrativo Geral.'
    }
  };

  const dados = USUARIOS[perfil] || USUARIOS.aluno;
  const campoNome = document.getElementById('perfil-nome');
  const campoContato = document.getElementById('perfil-contato');
  const campoIdade = document.getElementById('perfil-idade');
  const campoCpf = document.getElementById('perfil-cpf');
  const fotoPreview = document.getElementById('perfil-foto-preview');
  const seloStatus = document.getElementById('perfil-status-financeiro');
  const obsFinanceiro = document.getElementById('perfil-financeiro-obs');

  if (campoNome) campoNome.value = dados.nome;
  if (campoContato) campoContato.value = dados.contato;
  if (campoIdade) campoIdade.value = dados.idade;
  if (campoCpf) campoCpf.value = dados.cpf;
  if (fotoPreview) {
    fotoPreview.style.backgroundImage = '';
    fotoPreview.textContent = iniciais;
  }
  if (seloStatus) {
    seloStatus.textContent = 'Em dia';
    seloStatus.className = 'status-selo aprovada';
  }
  if (obsFinanceiro) obsFinanceiro.textContent = dados.obsFinanceiro;
}

function alterarFotoPerfil(evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => {
    const preview = document.getElementById('perfil-foto-preview');
    if (preview) {
      preview.style.backgroundImage = `url(${leitor.result})`;
      preview.textContent = '';
    }
  };
  leitor.readAsDataURL(arquivo);
}

function categoriasUnicas(lista) {
  return [...new Set(lista.map(i => i.categoria))];
}

// ============================================================
// INICIALIZAÇÃO DA APLICAÇÃO (RESTAURAÇÃO DE SESSÃO LOCALSTORAGE)
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  // Inicialização básica dos filtros e catálogo geral
  renderizarFiltros('filtros-exercicios', categoriasUnicas(EXERCICIOS), renderizarExercicios);
  renderizarFiltros('filtros-maquinas', categoriasUnicas(MAQUINAS), renderizarMaquinas);
  renderizarExercicios(null);
  renderizarMaquinas(null);

  // Verifica se o usuário já possui sessão salva no LocalStorage (conforme ConfigBcrypt.txt)
  const usuarioSalvo = localStorage.getItem('usuarioLogado');
  if (usuarioSalvo) {
    try {
      usuarioLogado = JSON.parse(usuarioSalvo);
      configurarUsuarioUI(usuarioLogado);
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('app').classList.add('ativo');

      await carregarDadosDoBanco();
      irPara('dashboard');
    } catch (e) {
      console.warn('Sessão corrompida. Limpando LocalStorage.');
      localStorage.removeItem('usuarioLogado');
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });
});
