/* ===========================================================
   MS ACADEMIA — lógica do sistema - Unibra 
   Dados (frame work) - base - exercícios iniciais e populares. Não posso esquecer de subir para o githu em forma publicaaaa.
=========================================================== */

// ---------- DADOS (simulando o banco de dados - ver quem do grupo vai ficar com sql, e se vai ser necessário) ----------

const MAQUINAS = [
  {
    id: 'm1', nome: 'Leg Press 45°', categoria: 'Inferiores',
    finalidade: 'Treinamento de membros inferiores (quadríceps, glúteos e posteriores).',
    descricao: 'Equipamento guiado que permite empurrar uma plataforma de carga através das pernas, com apoio total para as costas.',
    comoUsar: ['Ajuste o encosto para alinhar os joelhos a 90°.', 'Posicione os pés na largura dos ombros na plataforma.', 'Destrave as travas laterais somente após posicionar os pés.', 'Empurre a plataforma sem travar os joelhos no topo.'],
    cuidados: 'Nunca destravar as travas de segurança sem os pés firmes na plataforma. Evitar descer além do conforto do quadril.'
  },
  {
    id: 'm2', nome: 'Cadeira Extensora', categoria: 'Inferiores',
    foto: 'https://www.kikos.com.br/media/catalog/product/cache/041e82462066eef1ae3402cf9c4986f8/f/o/fotos_site_c2s71_-_cadeira_extensora_-_linha_concept_ii_-_kikos_pro_-_sku_i002115.jpg',
    finalidade: 'Isolamento do quadríceps.',
    descricao: 'Equipamento sentado com apoio para as costas e rolo de resistência para os tornozelos.',
    comoUsar: ['Ajuste o encosto para que o joelho fique alinhado ao eixo da máquina.', 'Posicione o rolo acima do tornozelo.', 'Estenda a perna controladamente até quase a extensão total.'],
    cuidados: 'Evitar travar o joelho com força no topo do movimento. Não usar carga excessiva em caso de dor articular.'
  },
  {
    id: 'm3', nome: 'Puxador Alto (Pulley)', categoria: 'Superiores',
    finalidade: 'Desenvolvimento das costas (latíssimo do dorso) e bíceps.',
    descricao: 'Equipamento com cabo e barra suspensa, utilizado sentado com apoio para as coxas.',
    comoUsar: ['Ajuste o apoio de coxas antes de sentar.', 'Segure a barra com pegada um pouco mais aberta que os ombros.', 'Puxe a barra em direção à parte superior do peito.', 'Retorne controlando o peso até a extensão dos braços.'],
    cuidados: 'Evitar balançar o tronco para gerar impulso. Não puxar a barra atrás da nuca.'
   
  },

  {
    id: 'm4', nome: 'Supino Reto (Banco Livre)', categoria: 'Superiores',
    finalidade: 'Desenvolvimento de peitoral, ombros e tríceps.',
    descricao: 'Banco com suporte de barra para exercício de empurrar com peso livre.',
    comoUsar: ['Deite com os olhos alinhados à barra.', 'Mantenha os pés firmes no chão e a lombar levemente apoiada.', 'Desça a barra controladamente até tocar próximo ao peito.', 'Empurre até a extensão dos cotovelos sem travá-los com força.'],
    cuidados: 'Sempre usar um profissional ou observador (spotter) ao aumentar a carga. Não realizar sem aquecimento prévio.'
  },
  {
    id: 'm5', nome: 'Esteira Ergométrica', categoria: 'Cardio',
    finalidade: 'Condicionamento cardiovascular e aquecimento.',
    descricao: 'Equipamento de caminhada/corrida com esteira motorizada e painel de controle de velocidade e inclinação.',
    comoUsar: ['Inicie em velocidade baixa antes de acelerar.', 'Utilize a trava de segurança presa à roupa.', 'Ajuste inclinação conforme orientação do profissional.'],
    cuidados: 'Nunca subir ou descer com a esteira em movimento. Manter hidratação durante o uso prolongado.'
  },
  {
    id: 'm6', nome: 'Cadeira Flexora', categoria: 'Inferiores',
    finalidade: 'Isolamento dos músculos posteriores da coxa.',
    descricao: 'Equipamento sentado ou deitado (conforme modelo) com rolo de resistência para flexão do joelho.',
    comoUsar: ['Posicione o rolo levemente acima do calcanhar.', 'Flexione o joelho trazendo o rolo em direção aos glúteos.', 'Retorne controladamente sem soltar o peso.'],
    cuidados: 'Evitar movimentos bruscos ou "chutar" a carga. Ajustar o encosto conforme a altura do usuário.'
  },
];

const EXERCICIOS = [
  {
    id: 'e1', nome: 'Agachamento no Smith', categoria: 'Inferiores', maquina: 'Smith Machine',
    comoExecutar: 'Posicione os pés um pouco à frente da barra, na largura dos ombros. Desça controlando o movimento até os quadris ficarem na altura dos joelhos, mantendo a coluna neutra.',
    errosComuns: 'Deixar os joelhos ultrapassarem muito a ponta dos pés; perder a curvatura natural da lombar durante a descida.',
    dicas: 'Respire fundo antes de descer e solte o ar ao subir. Mantenha o olhar à frente.',
    obs: 'Aumentar carga apenas quando a execução completa estiver estável, sem compensações.',
    videoId: 'TacQs5PxZsw',
  },
  {
    id: 'e2', nome: 'Extensão de Joelho', categoria: 'Inferiores', maquina: 'Cadeira Extensora',
    comoExecutar: 'Sentado, com o rolo apoiado acima do tornozelo, estenda a perna controladamente até quase a extensão total, sem travar o joelho.',
    errosComuns: 'Usar impulso do tronco; soltar o peso rapidamente na volta.',
    dicas: 'Contraia o quadríceps no topo do movimento por um segundo antes de descer.',
    obs: 'Indicado como aquecimento articular antes de exercícios compostos.',
    videoId: 'WEF-xCFB_t4',
  },
  {
    id: 'e3', nome: 'Puxada Alta', categoria: 'Superiores', maquina: 'Pulley Alto',
    comoExecutar: 'Sentado com apoio nas coxas, puxe a barra em direção à parte superior do peito, contraindo as escápulas.',
    errosComuns: 'Puxar a barra atrás da nuca; balançar o corpo para gerar impulso.',
    dicas: 'Imagine "levar os cotovelos ao bolso de trás" durante a puxada.',
    obs: 'Alunos com limitação de ombro devem reduzir amplitude conforme orientação.',
     videoId: 'x1MsU2cUBMY',
  },
  {
    id: 'e4', nome: 'Supino Reto', categoria: 'Superiores', maquina: 'Banco Livre',
    comoExecutar: 'Deitado no banco, desça a barra controladamente até próximo ao peito e empurre de volta à extensão dos cotovelos.',
    errosComuns: 'Arquear excessivamente a lombar; descer a barra rápido demais.',
    dicas: 'Mantenha as escápulas retraídas durante todo o movimento.',
    obs: 'Sempre executar com observador presente ao trabalhar cargas próximas ao limite.',
    videoId: 'EAlnA8j8A7c',
  },
  {
    id: 'e5', nome: 'Flexão de Joelho', categoria: 'Inferiores', maquina: 'Cadeira Flexora',
    comoExecutar: 'Flexione o joelho trazendo o rolo em direção aos glúteos, controlando o retorno até a extensão.',
    errosComuns: 'Levantar o quadril do banco; usar impulso ao invés de força controlada.',
    dicas: 'Movimento lento na fase de retorno intensifica o trabalho muscular.',
    obs: 'Reduzir amplitude em caso de desconforto no joelho.',
    videoId: 'am0vxQYZkpw',
  },
  {
    id: 'e6', nome: 'Caminhada em Esteira', categoria: 'Cardio', maquina: 'Esteira Ergométrica',
    comoExecutar: 'Inicie em velocidade baixa, aumente gradualmente conforme o aquecimento do corpo.',
    errosComuns: 'Segurar-se no corrimão durante todo o percurso, reduzindo o gasto energético.',
    dicas: 'Use para aquecimento de 5 a 10 minutos antes do treino de força.',
    obs: 'Indicado especialmente para alunos do perfil terceira idade e iniciantes.',
    videoId: 'zgJGgvE8mBA',
  },
];

// Treino do dia do aluno (TREINO_EXERCICIO)
const TREINO_HOJE = [
  { exercicioId: 'e1', series: 4, repeticoes: '10-12', carga: '40kg', descanso: '60s', feito: true },
  { exercicioId: 'e2', series: 3, repeticoes: '12-15', carga: '25kg', descanso: '45s', feito: true },
  { exercicioId: 'e5', series: 3, repeticoes: '12', carga: '20kg', descanso: '45s', feito: false },
  { exercicioId: 'e3', series: 4, repeticoes: '10', carga: '35kg', descanso: '60s', feito: false },
  { exercicioId: 'e4', series: 4, repeticoes: '8-10', carga: '30kg', descanso: '90s', feito: false },
];

const HISTORICO = [
  { data: '05/09/2026', treino: 'Treino A — Superiores', exercicios: 5, duracao: '48min', status: 'Concluído' },
  { data: '03/09/2026', treino: 'Treino B — Inferiores', exercicios: 5, duracao: '52min', status: 'Concluído' },
  { data: '01/09/2026', treino: 'Treino A — Superiores', exercicios: 5, duracao: '45min', status: 'Concluído' },
  { data: '29/08/2026', treino: 'Treino B — Inferiores', exercicios: 5, duracao: '50min', status: 'Concluído' },
  { data: '27/08/2026', treino: 'Treino A — Superiores', exercicios: 4, duracao: '30min', status: 'Parcial' },
];

const CONQUISTAS = [
  { icone: '🔥', nome: '4 dias seguidos', desc: 'Sequência atual', desbloqueada: true },
  { icone: '💪', nome: '10 treinos', desc: 'Marco de constância', desbloqueada: true },
  { icone: '📈', nome: 'Novo recorde', desc: 'Leg press +40kg', desbloqueada: true },
  { icone: '🎯', nome: 'Meta mensal', desc: '12 de 16 treinos', desbloqueada: false },
  { icone: '🏅', nome: '30 dias', desc: 'Sequência de 1 mês', desbloqueada: false },
  { icone: '⭐', nome: '50 treinos', desc: 'Meio-século de treinos', desbloqueada: false },
];

// ---------- ESTADO ----------
let perfilSelecionado = 'aluno';
let indiceExercicioAtivo = 0;
let cronometroTempo = 60;
let cronometroInterval = null;
let seriesFeitas = {};

// ---------- LOGIN ----------
function selecionarPerfilLogin(perfil, botao) {
  perfilSelecionado = perfil;
  document.querySelectorAll('.chip-perfil').forEach(b => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  const email = document.getElementById('campo-email');
  if (perfil === 'aluno') email.value = 'alunoteste@gmail.com';
  if (perfil === 'profissional') email.value = 'marcos.prof@msacademia.com';
  if (perfil === 'admin') email.value = 'admin@msacademia.com';
}

function entrarNoSistema() {
  document.getElementById('tela-login').style.display = 'none';
  const app = document.getElementById('app');
  app.classList.add('ativo');

  const nomes = { aluno: ['Alunoteste', 'AT', 'Aluno'], profissional: ['Marcos Lima', 'ML', 'Profissional'], admin: ['Equipe MS', 'EQ', 'Administrador'] };
  const [nome, iniciais, papel] = nomes[perfilSelecionado];
  document.getElementById('nome-usuario').textContent = nome;
  document.getElementById('avatar-usuario').textContent = iniciais;
  document.getElementById('papel-usuario').textContent = papel;
  document.getElementById('texto-saudacao').textContent = saudacaoPorHorario() + ', ' + nome.split(' ')[0] + ' 👋';

  irPara('dashboard');
}

function saudacaoPorHorario() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function sairDoSistema() {
  document.getElementById('app').classList.remove('ativo');
  document.getElementById('tela-login').style.display = 'flex';
}

// ---------- NAVEGAÇÃO ----------
function irPara(pagina) {
  document.querySelectorAll('.pagina').forEach(p => p.classList.remove('ativa'));
  const alvo = document.getElementById('pagina-' + pagina);
  if (alvo) alvo.classList.add('ativa');

  document.querySelectorAll('.nav-lista button').forEach(b => b.classList.remove('ativo'));
  const navBtn = document.querySelector('.nav-lista button[data-pagina="' + pagina + '"]');
  if (navBtn) navBtn.classList.add('ativo');

  window.scrollTo(0, 0);

  if (pagina === 'treino-ativo') carregarExercicioAtivo();
}

// ---------- DASHBOARD: lista do treino de hoje ----------
function renderizarTreinoHoje() {
  const container = document.getElementById('lista-treino-hoje');
  container.innerHTML = TREINO_HOJE.map((item, i) => {
    const ex = EXERCICIOS.find(e => e.id === item.exercicioId);
    return `
      <div class="item-exercicio">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <div class="info">
          <strong>${ex.nome}</strong>
          <span>${item.series}x${item.repeticoes} · ${item.carga} · descanso ${item.descanso}</span>
        </div>
        <span class="status ${item.feito ? 'feito' : 'pendente'}">${item.feito ? 'Feito' : 'Pendente'}</span>
      </div>
    `;
  }).join('');
}

// ---------- CATÁLOGO: EXERCÍCIOS ----------
function renderizarFiltros(containerId, categorias, callback) {
  const el = document.getElementById(containerId);
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
  grid.innerHTML = lista.map(ex => `
    <div class="ficha">
      <div class="ficha-topo">
        <span class="cat">${ex.categoria}</span>
        <h4>${ex.nome}</h4>
      </div>
      <div class="ficha-corpo">
        <p>${ex.comoExecutar.slice(0, 90)}...</p>
        <div class="ficha-tags"><span class="tag-mini">${ex.maquina}</span></div>
        <button class="abrir" onclick="abrirModalExercicio('${ex.id}')">Ver orientação completa →</button>
      </div>
    </div>
  `).join('');
}

function renderizarMaquinas(filtroCategoria) {
  const lista = filtroCategoria ? MAQUINAS.filter(m => m.categoria === filtroCategoria) : MAQUINAS;
  const grid = document.getElementById('grid-maquinas');
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
        <span class="tag-mini">Modelo 3D em breve</span>
      </div>
      <button class="abrir" onclick="abrirModalMaquina(\"${m.id}\")">Ver ficha completa →</button>
    </div>
  `).join('');
}



// ---------- MODAL ----------
function abrirModalExercicio(id) {
  const ex = EXERCICIOS.find(e => e.id === id);
  document.getElementById('modal-cat').textContent = ex.categoria + ' · ' + ex.maquina;
  document.getElementById('modal-titulo').textContent = ex.nome;
  document.getElementById('modal-corpo').innerHTML = `
  <div class="modal-visual"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${ex.videoId}" title="Vídeo demonstrativo" frameborder="0" allowfullscreen></iframe></div>
    <div class="bloco-modal"><h5>Como executar</h5><p>${ex.comoExecutar}</p></div>
    <div class="bloco-modal"><h5>Erros comuns</h5><p>${ex.errosComuns}</p></div>
    <div class="bloco-modal"><h5>Dicas de execução</h5><p>${ex.dicas}</p></div>
    <div class="bloco-modal"><div class="aviso-cuidado"><strong>Observação do profissional:</strong> ${ex.obs}</div></div>
  `;
  document.getElementById('sobreposicao').classList.add('ativa');
}
// vou colocar em link pq é menos pesadp!
function abrirModalMaquina(id) {
  const m = MAQUINAS.find(x => x.id === id);
  
  document.getElementById('modal-cat').textContent = m.categoria;
  document.getElementById('modal-titulo').textContent = m.nome;
  
  document.getElementById('modal-corpo').innerHTML = `
    <div class="modal-visual">
      <img src="${m.foto}" alt="${m.nome}">
    </div>
    <div class="bloco-modal">
      <h5>Descrição</h5>
      <p>${m.descriçao}</p>
    </div>
    <div class="bloco-modal">
      <h5>Como utilizar</h5>
      <ul>
        ${m.comousar.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
    <div class="bloco-modal">
      <div class="aviso-cuidado">
        <strong>Cuidados:</strong> ${m.cuidados}
      </div>
    </div>
  `;
  
  
  document.getElementById('sobreposicao').classList.add('ativa');
}

function fecharModal() {
  document.getElementById('sobreposicao').classList.remove('ativa');
}
function fecharModalSeFora(evento) {
  if (evento.target.id === 'sobreposicao') fecharModal();
}

// ---------- TREINO ATIVO ----------
function carregarExercicioAtivo() {
  const item = TREINO_HOJE[indiceExercicioAtivo];
  const ex = EXERCICIOS.find(e => e.id === item.exercicioId);

  document.getElementById('titulo-exercicio-ativo').textContent = ex.nome;
  document.getElementById('progresso-treino-ativo').textContent = `Exercício ${indiceExercicioAtivo + 1} de ${TREINO_HOJE.length}`;
  document.getElementById('ea-categoria').textContent = ex.categoria + ' · ' + ex.maquina;
  document.getElementById('ea-nome').textContent = ex.nome;
  document.getElementById('ea-como').textContent = ex.comoExecutar;
  document.getElementById('ea-obs').textContent = ex.obs;
const iframeVideo = document.querySelector('.video-mock iframe');
if (iframeVideo) {
  iframeVideo.src = `https://www.youtube.com/embed/${ex.videoId}`;
}
  const listaSeries = document.getElementById('lista-series');
  const chave = item.exercicioId;
  if (!seriesFeitas[chave]) seriesFeitas[chave] = Array(item.series).fill(false);

  listaSeries.innerHTML = Array.from({ length: item.series }).map((_, i) => `
    <div class="serie-linha">
      <span class="n">${i + 1}</span>
      <input type="text" value="${item.repeticoes}" aria-label="Repetições série ${i + 1}">
      <input type="text" value="${item.carga}" aria-label="Carga série ${i + 1}">
      <button class="marcar ${seriesFeitas[chave][i] ? 'feito' : ''}" onclick="marcarSerie('${chave}', ${i}, this)" aria-label="Marcar série ${i + 1} como concluída">✓</button>
    </div>
  `).join('');

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
    alert('Treino concluído! Registro salvo no histórico. 💪');
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

// ---------- CRONÔMETRO ----------
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
  document.getElementById('tempo-cron').textContent = formatarTempo(cronometroTempo);
}

// ---------- EVOLUÇÃO ----------
function renderizarGraficoCarga() {
  const dados = [32, 34, 34, 36, 38, 40];
  const semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  const max = Math.max(...dados);
  document.getElementById('grafico-carga').innerHTML = dados.map((v, i) => `
    <div class="barra ${i === dados.length - 1 ? 'destaque' : ''}" style="height:${(v / max) * 100}%;">
      <span class="valor">${v}</span>
      <small>${semanas[i]}</small>
    </div>
  `).join('');
}
function renderizarGraficoFrequencia() {
  const dados = [3, 4, 2, 4, 3, 4];
  const semanas = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  const max = 5;
  document.getElementById('grafico-frequencia').innerHTML = dados.map((v, i) => `
    <div class="barra ${i === dados.length - 1 ? 'destaque' : ''}" style="height:${(v / max) * 100}%;">
      <span class="valor">${v}</span>
      <small>${semanas[i]}</small>
    </div>
  `).join('');
}
function renderizarHistorico() {
  document.getElementById('corpo-historico').innerHTML = HISTORICO.map(h => `
    <tr>
      <td>${h.data}</td>
      <td>${h.treino}</td>
      <td>${h.exercicios}</td>
      <td>${h.duracao}</td>
      <td>${h.status}</td>
    </tr>
  `).join('');
}

// ---------- AVALIAÇÃO ----------
function enviarAvaliacao(evento) {
  evento.preventDefault();
  document.getElementById('status-avaliacao-area').innerHTML = `
    <div class="status-selo pendente">Status: pendente de análise</div>
    <p style="margin-top:0.7rem; font-size:0.85rem; color:#6B6259;">Sua avaliação foi enviada. O profissional responsável irá analisar e aprovar seu plano de treino em breve.</p>
  `;
  return false;
}

// ---------- CONQUISTAS ----------
function renderizarConquistas() {
  document.getElementById('grid-conquistas').innerHTML = CONQUISTAS.map(c => `
    <div class="conquista ${c.desbloqueada ? 'desbloqueada' : ''}">
      <div class="icone-c">${c.icone}</div>
      <strong>${c.nome}</strong>
      <small>${c.desc}</small>
    </div>
  `).join('');
}

// ---------- PERFIL ----------
function renderizarPerfil(perfil, iniciais) {
  const dados = USUARIOS[perfil];
  if (!dados) return;

  document.getElementById('perfil-nome').value = dados.nomeCompleto;
  document.getElementById('perfil-contato').value = dados.contato;
  document.getElementById('perfil-idade').value = dados.idade;
  document.getElementById('perfil-cpf').value = dados.cpf;

  const fotoPreview = document.getElementById('perfil-foto-preview');
  fotoPreview.style.backgroundImage = '';
  fotoPreview.textContent = iniciais;

  const emDia = dados.statusFinanceiro === 'emdia';

  const seloStatus = document.getElementById('perfil-status-financeiro');
  seloStatus.textContent = emDia ? 'Em dia' : 'Inadimplente';
  seloStatus.className = 'status-selo ' + (emDia ? 'aprovada' : 'inadimplente-selo');

  document.getElementById('perfil-financeiro-obs').textContent = dados.obsFinanceiro;

  const seloNav = document.getElementById('selo-financeiro-nav');
  seloNav.className = 'selo-financeiro-nav ' + (emDia ? 'ok' : 'alerta');
  seloNav.title = emDia ? 'Situação financeira: em dia' : 'Situação financeira: inadimplente';
}

function alterarFotoPerfil(evento) {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => {
    const preview = document.getElementById('perfil-foto-preview');
    preview.style.backgroundImage = `url(${leitor.result})`;
    preview.textContent = '';
  };
  leitor.readAsDataURL(arquivo);
}

// ---------- FILTROS: categorias disponíveis ----------
function categoriasUnicas(lista) {
  return [...new Set(lista.map(i => i.categoria))];
}

// ---------- INICIALIZAÇÃO ----------
document.addEventListener('DOMContentLoaded', () => {
  renderizarTreinoHoje();
  renderizarFiltros('filtros-exercicios', categoriasUnicas(EXERCICIOS), renderizarExercicios);
  renderizarFiltros('filtros-maquinas', categoriasUnicas(MAQUINAS), renderizarMaquinas);
  renderizarExercicios(null);
  renderizarMaquinas(null);
  renderizarGraficoCarga();
  renderizarGraficoFrequencia();
  renderizarHistorico();
  renderizarConquistas();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });
});
