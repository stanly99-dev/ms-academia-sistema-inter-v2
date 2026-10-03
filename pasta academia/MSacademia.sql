-- ============================================================
-- MS ACADEMIA — BANCO DE DADOS MYSQL
-- Projeto Interdisciplinar 2026.2 — UNIBRA
-- Compatível com MySQL 8.0+
-- ============================================================
-- Baseado no Documento de Especificação de Requisitos:
-- [RF01] Emitir contrato
-- [RF02] Restringir acesso aos dados do cliente
-- [RF03] Disponibilizar material instrucional (exercícios, máquinas, vídeos)
-- [RF04] Validar identidade do usuário (autenticação segura)
-- [RNF01] Tempo de carregamento (< 100ms através de índices)
-- [RNF02] Bloqueio por 3 tentativas incorretas de login
-- [RNF03] Proteção de dados pessoais e hash de senhas
-- [RNF04] Adaptabilidade para perfis idosos e iniciantes
-- ============================================================

DROP DATABASE IF EXISTS ms_academia;
CREATE DATABASE ms_academia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ms_academia;

-- ============================================================
-- 1. PERFIS DE ACESSO ([RF02] Controle de Permissões)
-- ============================================================
CREATE TABLE perfis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT INTO perfis (id, nome, descricao) VALUES
(1, 'Aluno', 'Acesso ao treino diário, evolução física, catálogo e perfil pessoal'),
(2, 'Profissional', 'Prescrição e personalização de treinos, avaliações físicas e orientações'),
(3, 'Administrador', 'Gestão geral, emissão de contratos, controle financeiro e de usuários');

-- ============================================================
-- 2. USUARIOS ([RF04], [RNF02], [RNF03] Autenticação e Segurança)
-- ============================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Compatibilidade com textos de desenvolvimento
    senha_hash VARCHAR(255) NULL, -- Hash seguro (ex: bcrypt conforme jsonTeste.txt)
    perfil_id INT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    tentativas_login INT NOT NULL DEFAULT 0, -- [RNF02] Bloqueio após 3 tentativas
    bloqueado_ate DATETIME NULL,            -- [RNF02] Timestamp de bloqueio temporário
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_perfil FOREIGN KEY (perfil_id) REFERENCES perfis(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 3. ALUNOS (Especialização do DER 3.1 & Suporte ao [RF01])
-- ============================================================
CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    contato VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    objetivo VARCHAR(100) NOT NULL DEFAULT 'Hipertrofia',
    observacoes TEXT NULL, -- Comorbidades, restrições e adaptações ([RNF04])
    status_financeiro ENUM('Em dia', 'Inadimplente') NOT NULL DEFAULT 'Em dia',
    obs_financeiro VARCHAR(255) DEFAULT 'Nenhuma pendência encontrada.',
    CONSTRAINT fk_alunos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. PROFISSIONAIS (Especialização do DER 3.1)
-- ============================================================
CREATE TABLE profissionais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    registro_profissional VARCHAR(30) NOT NULL UNIQUE, -- CREF (Conselho Regional de Educação Física)
    especialidade VARCHAR(100) DEFAULT 'Musculação e Condicionamento',
    CONSTRAINT fk_profissionais_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. CONTRATOS ([RF01] Emissão e Gestão de Contratos de Clientes)
-- ============================================================
CREATE TABLE contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_contrato VARCHAR(20) NOT NULL UNIQUE,
    aluno_id INT NOT NULL,
    emitido_por_id INT NOT NULL, -- Administrador ou responsável que gerou o contrato
    plano_nome VARCHAR(100) NOT NULL, -- Ex: 'Plano Anual Premium', 'Plano Semestral'
    valor_mensal DECIMAL(10,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status ENUM('Ativo', 'Encerrado', 'Pendente', 'Cancelado') NOT NULL DEFAULT 'Ativo',
    termos_aceitos BOOLEAN NOT NULL DEFAULT TRUE,
    conteudo_contrato TEXT NOT NULL,
    emitido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contratos_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_contratos_emissor FOREIGN KEY (emitido_por_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

-- ============================================================
-- 6. MÁQUINAS ([RF03], [RNF01] Material Instrucional)
-- ============================================================
CREATE TABLE maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    foto VARCHAR(500) NULL,
    modelo_3d VARCHAR(255) NULL, -- Especificado na Seção 3.1 do DER
    finalidade TEXT NOT NULL,
    descricao TEXT NOT NULL,
    cuidados TEXT NULL
) ENGINE=InnoDB;

-- Instruções detalhadas passo a passo de utilização da máquina
CREATE TABLE maquina_instrucoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquina_id INT NOT NULL,
    ordem INT NOT NULL,
    instrucao TEXT NOT NULL,
    CONSTRAINT fk_instrucoes_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 7. EXERCÍCIOS ([RF03], [RNF01] Catálogo e Materiais Instrucionais)
-- ============================================================
CREATE TABLE exercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    maquina_id INT NULL,
    descricao TEXT NULL,
    como_executar TEXT NOT NULL,
    erros_comuns TEXT NULL,
    instrucoes TEXT NULL, -- Campo especificado na Tabela 1 do documento
    dicas TEXT NULL,
    observacao TEXT NULL,
    video_id VARCHAR(50) NULL, -- ID do vídeo no YouTube (ex: TacQs5PxZsw)
    video_url VARCHAR(255) NULL,
    CONSTRAINT fk_exercicios_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 8. AVALIAÇÕES FÍSICAS ([RF02], DER 3.1)
-- ============================================================
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    profissional_id INT NULL,
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    objetivo VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    limitacoes TEXT NULL,
    observacoes TEXT NULL,
    status ENUM('Pendente', 'Aprovada', 'Rejeitada') NOT NULL DEFAULT 'Pendente',
    CONSTRAINT fk_avaliacoes_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_avaliacoes_profissional FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 9. TREINOS / PLANOS DE TREINO (DER 3.1)
-- ============================================================
CREATE TABLE treinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    profissional_id INT NULL,
    nome VARCHAR(100) NOT NULL,
    objetivo VARCHAR(100) NULL,
    fase VARCHAR(100) NULL, -- Ex: 'Fase 2 - Adaptação / Hipertrofia'
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_treinos_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_treinos_profissional FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Alias/compatibilidade: planos_treino aponta para treinos
CREATE OR REPLACE VIEW planos_treino AS SELECT * FROM treinos;

-- ============================================================
-- 10. TREINO_EXERCÍCIO (Tabela Associativa do DER 3.1)
-- ============================================================
CREATE TABLE treino_exercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    treino_id INT NOT NULL,
    exercicio_id INT NOT NULL,
    ordem INT NOT NULL,
    series INT NOT NULL DEFAULT 3,
    repeticoes VARCHAR(20) NOT NULL,
    carga VARCHAR(30) NULL,
    descanso VARCHAR(20) NULL,
    CONSTRAINT fk_treinoex_treino FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE CASCADE,
    CONSTRAINT fk_treinoex_exercicio FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_treino_exercicio (treino_id, exercicio_id)
) ENGINE=InnoDB;

-- Alias/compatibilidade: plano_exercicios aponta para treino_exercicios
CREATE OR REPLACE VIEW plano_exercicios AS SELECT * FROM treino_exercicios;

-- ============================================================
-- 11. REGISTRO DE TREINO & HISTÓRICO (DER 3.1 e Evolução)
-- ============================================================
-- Tabela representativa do DER 3.1: Registro_treino
CREATE TABLE registro_treino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    exercicio_id INT NOT NULL,
    data DATE NOT NULL DEFAULT (CURRENT_DATE),
    carga DECIMAL(8,2) NOT NULL,
    repeticoes INT NOT NULL,
    CONSTRAINT fk_regtreino_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_regtreino_exercicio FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sessões completas de treino realizado (para histórico e frequência semanal)
CREATE TABLE treinos_realizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    treino_id INT NULL,
    data_treino DATE NOT NULL,
    duracao_minutos INT NULL,
    status ENUM('Concluído', 'Parcial', 'Cancelado') NOT NULL DEFAULT 'Concluído',
    CONSTRAINT fk_trealizados_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_trealizados_treino FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Séries detalhadas por treino realizado
CREATE TABLE series_realizadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    treino_realizado_id INT NOT NULL,
    exercicio_id INT NOT NULL,
    numero_serie INT NOT NULL,
    repeticoes INT NOT NULL,
    carga DECIMAL(8,2) NOT NULL,
    concluida BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_series_trealizado FOREIGN KEY (treino_realizado_id) REFERENCES treinos_realizados(id) ON DELETE CASCADE,
    CONSTRAINT fk_series_exercicio FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 12. CONQUISTAS E GAMIFICAÇÃO (Constância do Aluno)
-- ============================================================
CREATE TABLE conquistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    icone VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE usuario_conquistas (
    usuario_id INT NOT NULL,
    conquista_id INT NOT NULL,
    data_desbloqueio DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (usuario_id, conquista_id),
    CONSTRAINT fk_uconquistas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_uconquistas_conquista FOREIGN KEY (conquista_id) REFERENCES conquistas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 13. ÍNDICES DE PERFORMANCE ([RNF01] < 100ms)
-- ============================================================
CREATE INDEX idx_exercicios_categoria ON exercicios(categoria);
CREATE INDEX idx_exercicios_video ON exercicios(video_id);
CREATE INDEX idx_maquinas_categoria ON maquinas(categoria);
CREATE INDEX idx_treinos_aluno_ativo ON treinos(aluno_id, ativo);
CREATE INDEX idx_treino_exercicios_ordem ON treino_exercicios(treino_id, ordem);
CREATE INDEX idx_regtreino_aluno_data ON registro_treino(aluno_id, data);
CREATE INDEX idx_trealizados_aluno_data ON treinos_realizados(aluno_id, data_treino);
CREATE INDEX idx_contratos_aluno ON contratos(aluno_id);

-- ============================================================
-- 14. CARGA INICIAL DE DADOS (SEEDS COERENTES COM O PROJETO)
-- ============================================================

-- Usuários: 1 Aluno, 1 Profissional, 1 Administrador
INSERT INTO usuarios (id, nome, email, senha, senha_hash, perfil_id, ativo, tentativas_login, bloqueado_ate) VALUES
(1, 'João Gabriel', 'alunoteste@gmail.com', '123456', '$2b$10$wT282Wj4N3aI66g4Qx14wOUu2J3kGk5cTjR4WJ9Cg1HqB1fNq7m2m', 1, TRUE, 0, NULL),
(2, 'Marcos Lima', 'marcos.prof@msacademia.com', '123456', '$2b$10$wT282Wj4N3aI66g4Qx14wOUu2J3kGk5cTjR4WJ9Cg1HqB1fNq7m2m', 2, TRUE, 0, NULL),
(3, 'Equipe MS', 'admin@msacademia.com', '123456', '$2b$10$wT282Wj4N3aI66g4Qx14wOUu2J3kGk5cTjR4WJ9Cg1HqB1fNq7m2m', 3, TRUE, 0, NULL);

-- Aluno completo com dados cadastrais e financeiros (necessário para Perfil e Contrato)
INSERT INTO alunos (id, usuario_id, cpf, contato, data_nascimento, objetivo, observacoes, status_financeiro, obs_financeiro) VALUES
(1, 1, '123.456.789-00', '(81) 98765-4321', '2004-05-15', 'Hipertrofia', 'Aluno com leve sensibilidade no joelho direito. Indicado foco em postura e amplitude controlada.', 'Em dia', 'Nenhuma pendência encontrada.');

-- Profissional com CREF
INSERT INTO profissionais (id, usuario_id, registro_profissional, especialidade) VALUES
(1, 2, 'CREF 012345-G/PE', 'Musculação, Reabilitação e Hipertrofia');

-- Contrato emitido para o Aluno ([RF01])
INSERT INTO contratos (id, numero_contrato, aluno_id, emitido_por_id, plano_nome, valor_mensal, data_inicio, data_fim, status, termos_aceitos, conteudo_contrato) VALUES
(1, 'CTR-2026-0001', 1, 3, 'Plano Anual Fidelidade MS', 119.90, '2026-01-10', '2027-01-10', 'Ativo', TRUE,
'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ATIVIDADE FÍSICA - MS ACADEMIA\nCONTRATANTE: João Gabriel, CPF: 123.456.789-00\nCONTRATADA: MS Academia LTDA.\nCLÁUSULA 1: O presente contrato tem por objeto a disponibilização de instalações e acompanhamento de treinos personalizados orientados por profissionais qualificados.\nCLÁUSULA 2: Mensalidade fixada em R$ 119,90 com vencimento todo dia 10.\nCLÁUSULA 3: Vigência de 12 meses renováveis mediante termo aditivo.');

-- Máquinas com dados completos, fotos e indicação de Modelo 3D
INSERT INTO maquinas (id, nome, categoria, foto, modelo_3d, finalidade, descricao, cuidados) VALUES
(1, 'Leg Press 45°', 'Inferiores', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'modelos3d/legpress45.glb',
 'Treinamento de membros inferiores (quadríceps, glúteos e posteriores).',
 'Equipamento guiado que permite empurrar uma plataforma de carga através das pernas, com apoio total para as costas.',
 'Nunca destravar as travas de segurança sem os pés firmes na plataforma. Evitar descer além do conforto do quadril.'),

(2, 'Cadeira Extensora', 'Inferiores', 'https://www.kikos.com.br/media/catalog/product/cache/041e82462066eef1ae3402cf9c4986f8/f/o/fotos_site_c2s71_-_cadeira_extensora_-_linha_concept_ii_-_kikos_pro_-_sku_i002115.jpg', 'modelos3d/extensora.glb',
 'Isolamento do quadríceps.',
 'Equipamento sentado com apoio para as costas e rolo de resistência para os tornozelos.',
 'Evitar travar o joelho com força no topo do movimento. Não usar carga excessiva em caso de dor articular.'),

(3, 'Puxador Alto (Pulley)', 'Superiores', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600', 'modelos3d/pulley.glb',
 'Desenvolvimento das costas (latíssimo do dorso) e bíceps.',
 'Equipamento com cabo e barra suspensa, utilizado sentado com apoio para as coxas.',
 'Evitar balançar o tronco para gerar impulso. Não puxar a barra atrás da nuca.'),

(4, 'Supino Reto (Banco Livre)', 'Superiores', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600', 'modelos3d/supinoreto.glb',
 'Desenvolvimento de peitoral, ombros e tríceps.',
 'Banco com suporte de barra para exercício de empurrar com peso livre.',
 'Sempre usar um profissional ou observador (spotter) ao aumentar a carga. Não realizar sem aquecimento prévio.'),

(5, 'Esteira Ergométrica', 'Cardio', 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600', 'modelos3d/esteira.glb',
 'Condicionamento cardiovascular e aquecimento.',
 'Equipamento de caminhada/corrida com esteira motorizada e painel de controle de velocidade e inclinação.',
 'Nunca subir ou descer com a esteira em movimento. Manter hidratação durante o uso prolongado.'),

(6, 'Cadeira Flexora', 'Inferiores', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600', 'modelos3d/flexora.glb',
 'Isolamento dos músculos posteriores da coxa.',
 'Equipamento sentado ou deitado com rolo de resistência para flexão do joelho.',
 'Evitar movimentos bruscos ou "chutar" a carga. Ajustar o encosto conforme a altura do usuário.');

-- Instruções de máquinas
INSERT INTO maquina_instrucoes (maquina_id, ordem, instrucao) VALUES
(1, 1, 'Ajuste o encosto para alinhar os joelhos a 90°.'),
(1, 2, 'Posicione os pés na largura dos ombros na plataforma.'),
(1, 3, 'Destrave as travas laterais somente após posicionar os pés.'),
(1, 4, 'Empurre a plataforma sem travar os joelhos no topo.'),
(2, 1, 'Ajuste o encosto para que o joelho fique alinhado ao eixo da máquina.'),
(2, 2, 'Posicione o rolo acima do tornozelo.'),
(2, 3, 'Estenda a perna controladamente até quase a extensão total.'),
(3, 1, 'Ajuste o apoio de coxas antes de sentar.'),
(3, 2, 'Segure a barra com pegada um pouco mais aberta que os ombros.'),
(3, 3, 'Puxe a barra em direção à parte superior do peito.'),
(3, 4, 'Retorne controlando o peso até a extensão dos braços.'),
(4, 1, 'Deite com os olhos alinhados à barra.'),
(4, 2, 'Mantenha os pés firmes no chão e a lombar levemente apoiada.'),
(4, 3, 'Desça a barra controladamente até tocar próximo ao peito.'),
(4, 4, 'Empurre até a extensão dos cotovelos sem travá-los com força.'),
(5, 1, 'Inicie em velocidade baixa antes de acelerar.'),
(5, 2, 'Utilize a trava de segurança presa à roupa.'),
(5, 3, 'Ajuste inclinação conforme orientação do profissional.'),
(6, 1, 'Posicione o rolo levemente acima do calcanhar.'),
(6, 2, 'Flexione o joelho trazendo o rolo em direção aos glúteos.'),
(6, 3, 'Retorne controladamente sem soltar o peso.');

-- Exercícios completos com vídeos demonstrativos
INSERT INTO exercicios (id, nome, categoria, maquina_id, descricao, como_executar, erros_comuns, instrucoes, dicas, observacao, video_id, video_url) VALUES
(1, 'Agachamento no Smith', 'Inferiores', 1,
 'Exercício multiarticular focado em quadríceps, glúteos e posterior de coxa guiado por barra fixa.',
 'Posicione os pés um pouco à frente da barra, na largura dos ombros. Desça controlando o movimento até os quadris ficarem na altura dos joelhos, mantendo a coluna neutra.',
 'Deixar os joelhos ultrapassarem muito a ponta dos pés; perder a curvatura natural da lombar durante a descida.',
 'Mantenha o peito aberto e os calcanhares colados no chão durante toda a descida.',
 'Respire fundo antes de descer e solte o ar ao subir. Mantenha o olhar à frente.',
 'Aumentar carga apenas quando a execução completa estiver estável, sem compensações.',
 'TacQs5PxZsw', 'https://www.youtube.com/watch?v=TacQs5PxZsw'),

(2, 'Extensão de Joelho', 'Inferiores', 2,
 'Exercício monoarticular isolador do quadríceps na cadeira extensora.',
 'Sentado, com o rolo apoiado acima do tornozelo, estenda a perna controladamente até quase a extensão total, sem travar o joelho.',
 'Usar impulso do tronco; soltar o peso rapidamente na volta.',
 'Ajuste o banco para que o eixo de rotação do joelho coincida exatamente com o eixo do aparelho.',
 'Contraia o quadríceps no topo do movimento por um segundo antes de descer.',
 'Indicado como aquecimento articular antes de exercícios compostos.',
 'WEF-xCFB_t4', 'https://www.youtube.com/watch?v=WEF-xCFB_t4'),

(3, 'Puxada Alta', 'Superiores', 3,
 'Desenvolvimento do grande dorsal, romboides e bíceps.',
 'Sentado com apoio nas coxas, puxe a barra em direção à parte superior do peito, contraindo as escápulas.',
 'Puxar a barra atrás da nuca; balançar o corpo para gerar impulso.',
 'Mantenha os cotovelos apontados levemente para a frente e tronco ereto.',
 'Imagine "levar os cotovelos ao bolso de trás" durante a puxada.',
 'Alunos com limitação de ombro devem reduzir amplitude conforme orientação.',
 'x1MsU2cUBMY', 'https://www.youtube.com/watch?v=x1MsU2cUBMY'),

(4, 'Supino Reto', 'Superiores', 4,
 'Exercício base para peitoral maior, deltóide anterior e tríceps braquial.',
 'Deitado no banco, desça a barra controladamente até próximo ao peito e empurre de volta à extensão dos cotovelos.',
 'Arquear excessivamente a lombar; descer a barra rápido demais.',
 'Posicione as mãos a uma largura onde os antebraços fiquem verticais na base do movimento.',
 'Mantenha as escápulas retraídas durante todo o movimento.',
 'Sempre executar com observador presente ao trabalhar cargas próximas ao limite.',
 'EAlnA8j8A7c', 'https://www.youtube.com/watch?v=EAlnA8j8A7c'),

(5, 'Flexão de Joelho', 'Inferiores', 6,
 'Exercício isolador para músculos isquiotibiais.',
 'Flexione o joelho trazendo o rolo em direção aos glúteos, controlando o retorno até a extensão.',
 'Levantar o quadril do banco; usar impulso ao invés de força controlada.',
 'Mantenha o quadril firme pressionado contra o estofamento.',
 'Movimento lento na fase de retorno intensifica o trabalho muscular.',
 'Reduzir amplitude em caso de desconforto no joelho.',
 'am0vxQYZkpw', 'https://www.youtube.com/watch?v=am0vxQYZkpw'),

(6, 'Caminhada em Esteira', 'Cardio', 5,
 'Atividade aeróbica para aquecimento, condicionamento e queima calórica.',
 'Inicie em velocidade baixa, aumente gradualmente conforme o aquecimento do corpo.',
 'Segurar-se no corrimão durante todo o percurso, reduzindo o gasto energético.',
 'Mantenha postura ereta e passadas naturais.',
 'Use para aquecimento de 5 a 10 minutos antes do treino de força.',
 'Indicado especialmente para alunos do perfil terceira idade e iniciantes (RNF04).',
 'zgJGgvE8mBA', 'https://www.youtube.com/watch?v=zgJGgvE8mBA');

-- Avaliação física do aluno
INSERT INTO avaliacoes (id, aluno_id, profissional_id, data, objetivo, nivel, limitacoes, observacoes, status) VALUES
(1, 1, 1, '2026-08-20 10:30:00', 'Hipertrofia', 'Iniciante', 'Desconforto leve no joelho direito em flexão profunda', 'Plano liberado com aquecimento prévio obrigatório na esteira e extensão de joelho leve.', 'Aprovada');

-- Treino ativo (Prescrito pelo Prof. Marcos para o Aluno João Gabriel)
INSERT INTO treinos (id, aluno_id, profissional_id, nome, objetivo, fase, ativo, data_criacao) VALUES
(1, 1, 1, 'Hipertrofia — Fase 2', 'Hipertrofia', 'Fase 2', TRUE, '2026-08-25');

-- Exercícios do treino prescrito
INSERT INTO treino_exercicios (treino_id, exercicio_id, ordem, series, repeticoes, carga, descanso) VALUES
(1, 1, 1, 4, '10-12', '40kg', '60s'),
(1, 2, 2, 3, '12-15', '25kg', '45s'),
(1, 5, 3, 3, '12', '20kg', '45s'),
(1, 3, 4, 4, '10', '35kg', '60s'),
(1, 4, 5, 4, '8-10', '30kg', '90s');

-- Registros de treinos (Entidade Registro_Treino do DER 3.1)
INSERT INTO registro_treino (aluno_id, exercicio_id, data, carga, repeticoes) VALUES
(1, 1, '2026-08-27', 32.0, 10),
(1, 1, '2026-08-29', 34.0, 10),
(1, 1, '2026-09-01', 34.0, 12),
(1, 1, '2026-09-03', 36.0, 10),
(1, 1, '2026-09-05', 38.0, 10),
(1, 1, '2026-09-08', 40.0, 12);

-- Sessões completas de treino realizado
INSERT INTO treinos_realizados (id, aluno_id, treino_id, data_treino, duracao_minutos, status) VALUES
(1, 1, 1, '2026-09-05', 48, 'Concluído'),
(2, 1, 1, '2026-09-03', 52, 'Concluído'),
(3, 1, 1, '2026-09-01', 45, 'Concluído'),
(4, 1, 1, '2026-08-29', 50, 'Concluído'),
(5, 1, 1, '2026-08-27', 30, 'Parcial');

-- Séries detalhadas realizadas
INSERT INTO series_realizadas (treino_realizado_id, exercicio_id, numero_serie, repeticoes, carga, concluida) VALUES
(1, 1, 1, 12, 40.0, TRUE),
(1, 1, 2, 12, 40.0, TRUE),
(1, 1, 3, 10, 40.0, TRUE),
(1, 1, 4, 10, 40.0, TRUE),
(1, 2, 1, 15, 25.0, TRUE),
(1, 2, 2, 14, 25.0, TRUE),
(1, 2, 3, 12, 25.0, TRUE);

-- Conquistas do sistema
INSERT INTO conquistas (id, nome, descricao, icone) VALUES
(1, '4 dias seguidos', 'Sequência atual de frequência', '🔥'),
(2, '10 treinos', 'Marco de constância nos treinos', '💪'),
(3, 'Novo recorde', 'Leg press com carga superior a 40kg', '📈'),
(4, 'Meta mensal', '12 de 16 treinos realizados no mês', '🎯'),
(5, '30 dias', 'Sequência contínua de 1 mês de treinos', '🏅'),
(6, '50 treinos', 'Meio-século de treinos concluídos', '⭐');

-- Conquistas desbloqueadas pelo aluno João Gabriel
INSERT INTO usuario_conquistas (usuario_id, conquista_id, data_desbloqueio) VALUES
(1, 1, '2026-09-05'),
(1, 2, '2026-09-03'),
(1, 3, '2026-09-05');

-- ============================================================
-- 15. VIEWS CONSOLIDADAS PARA O SISTEMA E BACKEND
-- ============================================================

-- View com dados consolidados do aluno (perfil, contato e financeiro)
CREATE OR REPLACE VIEW vw_alunos AS
SELECT 
    u.id AS usuario_id,
    a.id AS aluno_id,
    u.nome,
    u.email,
    a.cpf,
    a.contato,
    a.data_nascimento,
    TIMESTAMPDIFF(YEAR, a.data_nascimento, CURDATE()) AS idade,
    a.objetivo,
    a.observacoes,
    a.status_financeiro,
    a.obs_financeiro,
    u.ativo
FROM usuarios u
INNER JOIN alunos a ON a.usuario_id = u.id;

-- View do treino ativo do aluno com exercícios e máquinas associadas
CREATE OR REPLACE VIEW vw_treino_ativo AS
SELECT 
    t.id AS treino_id,
    t.aluno_id,
    u_aluno.nome AS aluno_nome,
    u_prof.nome AS profissional_responsavel,
    t.nome AS plano_nome,
    t.objetivo,
    t.fase,
    te.ordem,
    e.id AS exercicio_id,
    e.nome AS exercicio_nome,
    e.categoria,
    m.nome AS maquina_nome,
    te.series,
    te.repeticoes,
    te.carga,
    te.descanso,
    e.video_id
FROM treinos t
INNER JOIN alunos a ON a.id = t.aluno_id
INNER JOIN usuarios u_aluno ON u_aluno.id = a.usuario_id
LEFT JOIN profissionais p ON p.id = t.profissional_id
LEFT JOIN usuarios u_prof ON u_prof.id = p.usuario_id
INNER JOIN treino_exercicios te ON te.treino_id = t.id
INNER JOIN exercicios e ON e.id = te.exercicio_id
LEFT JOIN maquinas m ON m.id = e.maquina_id
WHERE t.ativo = TRUE;

-- View do catálogo de exercícios completo com máquina e vídeo
CREATE OR REPLACE VIEW vw_catalogo_exercicios AS
SELECT 
    e.id,
    e.nome,
    e.categoria,
    m.nome AS maquina,
    e.como_executar,
    e.erros_comuns,
    e.dicas,
    e.observacao,
    e.video_id,
    m.foto AS foto_maquina,
    m.modelo_3d
FROM exercicios e
LEFT JOIN maquinas m ON m.id = e.maquina_id;

-- ============================================================
-- 16. CONSULTAS DE NEGÓCIO PRONTAS (EXEMPLOS OPERACIONAIS)
-- ============================================================

-- 1. [RF04] / [RNF02] Validação de login com verificação de bloqueio
-- Se tentativas >= 3 e bloqueado_ate > NOW(), o login é impedido.
SELECT 
    u.id, 
    u.nome, 
    u.email, 
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
WHERE u.email = 'alunoteste@gmail.com';

-- 2. [RF01] Consulta para conferência e emissão do contrato do aluno
SELECT 
    c.numero_contrato,
    u_aluno.nome AS nome_cliente,
    a.cpf,
    a.contato,
    c.plano_nome,
    c.valor_mensal,
    c.data_inicio,
    c.data_fim,
    c.status AS status_contrato,
    a.status_financeiro,
    u_emissor.nome AS emitido_por,
    c.conteudo_contrato
FROM contratos c
INNER JOIN alunos a ON a.id = c.aluno_id
INNER JOIN usuarios u_aluno ON u_aluno.id = a.usuario_id
INNER JOIN usuarios u_emissor ON u_emissor.id = c.emitido_por_id
WHERE a.id = 1;

-- 3. [RF03] / [RNF01] Consulta de alta performance para a lista de vídeos
SELECT 
    id, 
    nome, 
    categoria, 
    video_id, 
    video_url
FROM exercicios
WHERE video_id IS NOT NULL
ORDER BY categoria, nome;

-- 4. Consulta de evolução de carga do aluno (Agachamento no Smith)
SELECT 
    rt.data,
    e.nome AS exercicio,
    rt.carga,
    rt.repeticoes
FROM registro_treino rt
INNER JOIN exercicios e ON e.id = rt.exercicio_id
WHERE rt.aluno_id = 1 
  AND e.nome LIKE '%Agachamento%'
ORDER BY rt.data ASC;
