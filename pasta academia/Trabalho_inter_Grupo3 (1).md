## CURSO SUPERIOR DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE CENTRO UNIVERSITÁRIO BRASILEIRO - UNIBRA SISTEMAS

Alberto, Arthur Batista, Eduardo Oliveira, Erik Aquim, Gabriel, Helio Sena, Henrique, Jorge, Julio Santos, Leandro Medeiros, Lucas Pereira, Matheus Alves, Maxwel, Nickolas Stanly, Rafael

Alexandre.

## DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS INTERDISCIPLINAR 2026.2

## Recife 2026


## CURSO SUPERIOR DE TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE CENTRO UNIVERSITÁRIO BRASILEIRO - UNIBRA SISTEMAS

Alberto, Arthur Batista, Eduardo Oliveira, Erik Aquim, Gabriel, Helio Sena, Henrique, Jorge, Julio Santos, Leandro Medeiros, Lucas Pereira, Matheus Alves, Maxwel, Nickolas Stanly, Rafael

Alexandre.

## DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS INTERDISCIPLINAR 2026.2

Documento apresentado como requisito parcial da atividade Interdisciplinar do 2º período do Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas do Centro Universitário Brasileiro - UNIBRA, sob orientação do Professor Fomentador Hugo Leonardo.

Recife

2026


## SUMÁRIO


## HISTÓRICO DAS ALTERAÇÕES

| DATA | DESCRIÇÃO | RESPONSÁVEL |
| --- | --- | --- |
| 09.09.2026 | Versão inicial: seções 1.1 e 1.2 | Matheus Alves |
| 18.09.2026 | Seção 1.3 e capítulo 2 | Matheus Alves |
| 25.09.2026 | Seção 3 | Matheus Alves |


## 1 INTRODUÇÃO

## 1.1 Proposta

A proposta consiste no desenvolvimento de um sistema para a MS Academia, voltado ao acompanhamento dos alunos e à organização de treinos personalizados.

O sistema pretende facilitar o trabalho dos profissionais, permitindo o cadastro dos alunos, a criação e personalização de treinos e o acompanhamento da evolução de cada pessoa.

Para os alunos, a plataforma oferecerá acesso ao treino do dia, exercícios,

séries, repetições, cargas, períodos de descanso e histórico de atividades. Também contará com informações sobre exercícios e equipamentos, incluindo instruções de utilização.

Dessa forma, o sistema busca resolver problemas de organização,

acompanhamento e orientação dos treinos, proporcionando uma experiência mais personalizada, acessível e interativa. A ferramenta servirá como apoio aos profissionais da academia, sem substituir a

avaliação e a responsabilidade do profissional habilitado.

## 1.2 Problema e solução

Nas academias tradicionais, a prescrição e o acompanhamento dos treinos ainda dependem, em grande parte, de fichas de papel, planilhas genéricas ou da memorização das atividades pelo aluno. Esse modelo dificulta a personalização dos exercícios, o acompanhamento da evolução física e a organização da rotina, além de aumentar o risco de exercícios inadequados para alunos com comorbidades, lesões ou outras restrições.

Outro problema está na dificuldade de registrar e visualizar a evolução do aluno, como cargas utilizadas, composição corporal e frequência. A falta de uma estrutura organizada também pode dificultar a compreensão da sequência de exercícios e das atividades diárias.

Como solução, propõe-se o desenvolvimento de um aplicativo que conecte instrutor e aluno, centralizando informações da avaliação física, restrições individuais e planejamento dos treinos. O sistema permitirá organizar os exercícios por dias e etapas, incluindo aquecimento, treino principal, séries, repetições, cargas e desaquecimento, além de possibilitar o acompanhamento da evolução por meio do histórico de treinos, frequência e cargas.

Dessa forma, busca-se proporcionar maior organização, personalização e segurança no acompanhamento dos treinamentos, facilitando o trabalho do instrutor e a experiência do aluno.


## 1.3 Glossário

| SIGLA / TERMO | Descrição |
| --- | --- |
| Comorbidade | Presença de duas ou mais condições de saúde em uma mesma pessoa. |
| Login | Processo de autenticação que permite ao usuário acessar o sistema mediante o fornecimento de credenciais, como nome de usuário e senha. |
| Material instrucional | Conteúdo destinado a orientar o usuário sobre a execução de exercícios e a utilização de equipamentos ou procedimentos. |
| NF | Requisito não funcional: requisito que estabelece características, restrições ou condições de funcionamento do sistema, como segurança e desempenho. |
| RF | Requisito funcional: requisito que descreve uma função ou operação que o sistema deve realizar. |
| UML | Unified Modeling Language ou Linguagem de Modelagem Unificada é uma linguagem visual padrão usada para visualizar, especificar, construir e documentar sistemas de software. |


## 2 REQUISITOS DO SISTEMA

## 2.1 Requisitos funcionais.

|   | [RF01] Emitir contrato |
| --- | --- |
| Descrição | O sistema deve permitir que o usuário responsável realize a emissão do contrato do cliente após o preenchimento e a confirmação das informações necessárias. O sistema deve disponibilizar os dados do contrato de forma organizada, permitindo sua conferência antes da emissão e garantindo que somente usuários autorizados possam realizar essa operação. |
| Procedimentos | 1. Acessar o menu de contratos 2. Localizar e selecionar o cliente desejado 3. Conferir os dados cadastrados do cliente 4. Confirmar a emissão do contrato 5. Gerar e disponibilizar o contrato para visualização ou impressão |
| Prioridade | Essencial |

|   | [RF02] Restringir acesso aos dados do cliente |
| --- | --- |
| Descrição | O sistema deve permitir que o acesso às informações dos clientes seja realizado de acordo com o nível de permissão atribuído a cada usuário. Dessa forma, usuários com diferentes funções terão acesso somente às informações e funcionalidades necessárias para o desempenho de suas atividades, evitando que dados restritos sejam visualizados ou manipulados por usuários não autorizados. |
| Procedimentos | 1. Realizar o login no sistema 2. Identificar o perfil e as permissões do usuário 3. Acessar o menu de clientes 4. Exibir somente os dados permitidos para o perfil do usuário 5. Bloquear o acesso às informações ou funcionalidades que não estejam autorizadas |
| Prioridade | Essencial |


|   | [RF03] Disponibilizar material instrucional |
| --- | --- |
| Descrição | O sistema deve permitir que os usuários tenham acesso a materiais instrucionais relacionados à utilização dos equipamentos e aos procedimentos necessários para a realização de suas atividades. Os materiais devem ser disponibilizados de forma organizada, possibilitando que o usuário localize e consulte os conteúdos necessários sempre que houver necessidade de orientação. |
| Procedimentos | 1. Acessar o menu de materiais instrucionais 2. Visualizar a lista de materiais disponíveis 3. Selecionar o vídeo ou material desejado 4. Aguardar o carregamento do conteúdo 5. Aguardar o carregamento do conteúdo |
| Prioridade | Adequação funcional |

|   | [RF04] Validar identidade do usuário |
| --- | --- |
| Descrição | O sistema deve realizar a validação da identidade do usuário antes de permitir o acesso a funcionalidades ou informações que contenham dados sensíveis. A validação deverá utilizar as credenciais cadastradas no sistema, garantindo que somente usuários devidamente autenticados e autorizados possam consultar ou manipular essas informações |
| Procedimentos | 1. Acessar a tela de login ou a funcionalidade que exige validação 2. Informar o login do usuário 3. Informar a senha cadastrada 4. O sistema deve verificar as credenciais informadas 5. Em caso de validação positiva, permitir o acesso à funcionalidade 6. Em caso de dados incorretos, negar o acesso e informar o usuário sobre a falha na autenticação. |
| Prioridade | Essencial |


## 2.2 Requisitos não funcionais

|   | [RNF01] Tempo de carregamento |
| --- | --- |
| Descrição | O sistema deve carregar a página de lista de vídeos em, no máximo, 0,1 segundo (100 milissegundos) após a solicitação do usuário. O tempo deve ser contabilizado desde o envio da solicitação de acesso à página até a disponibilização da lista de vídeos para visualização.. |
| Tipo de requisito Desempenho |   |

|   | [RNF02] Restrição de acesso por tentativas de login |
| --- | --- |
| Descrição | O sistema deve bloquear o acesso à conta do usuário após três tentativas consecutivas de login com credenciais incorretas. Após o bloqueio, o sistema não deve permitir novas tentativas de autenticação para a conta bloqueada até que seja cumprido o período de bloqueio definido pelo sistema ou realizado o procedimento de desbloqueio previsto. |
| Tipo de requisito | Segurança |

|   | [RNF03] Proteção de dados pessoais |
| --- | --- |
| Descrição | O sistema deve proteger os dados pessoais dos usuários, permitindo o acesso a essas informações somente mediante autenticação. |
| Tipo de requisito | Segurança |

|   | [RNF04] Adaptabilidade da experiência do usuário |
| --- | --- |
| Descrição | O sistema deve permitir a adaptação da experiência do usuário a diferentes perfis, como pessoas idosas e iniciantes. |
| Tipo de requisito Usabilidade |   |


## 3. MODELOS DO SISTEMA

## 3.1 Modelo de dados

O modelo inicial do banco de dados apresentado no projeto é representado

por um Diagrama Entidade-Relacionamento (DER), composto pelas entidades Usuario, Aluno, Profissional, Avaliacao, Treino, Exercicio, Maquina, Treino_Exercicio e Registro_Treino. Cada entidade possui atributos que descrevem suas características e informações, além de chaves primárias e estrangeiras responsáveis pela identificação dos registros e pela integração entre as tabelas.

A modelagem foi estruturada para representar as principais funcionalidades

do sistema da academia, estabelecendo os relacionamentos entre usuários, alunos e profissionais, bem como entre treinos, exercícios, máquinas e registros de atividades. As cardinalidades definem a quantidade de ocorrências que uma entidade pode ter em relação a outra, permitindo compreender as regras de associação entre os dados.

A Tabela 1 apresenta as entidades e seus principais atributos, enquanto a

Figura 1 ilustra o Diagrama Entidade-Relacionamento, incluindo as chaves, os relacionamentos e suas respectivas cardinalidades.

| Entidade | Principais campos |
| --- | --- |
| Usuario | id, nome, email, senha, tipo_usuario |
| Aluno | id, usuario_id, data_nascimento, objetivo, observacoes |
| Profissional | id, usuario_id, registro_profissional |
| Avaliacao | id, aluno_id, data, observacoes, status |
| Treino | id, aluno_id, profissional_id, nome, objetivo, data_criacao |
| Exercício | id, nome, descricao, instrucoes, video, maquina_id |
| Máquina | id, nome, descricao, finalidade, modelo_3d, cuidados |
|   | Treino_exercício id, treino_id, exercicio_id, series, repeticoes, carga, descanso |
|   | Registro_treino id, aluno_id, exercicio_id, data, carga, repeticoes |


## 3.1 Modelo de dados - representação visual

Modelo inicial de dados - Sistema da Academia

## 3.2 Diagrama de classes

O Diagrama de Classes é um dos diagramas estruturais mais fundamentais da Unified Modeling Language, conhecida como UML. Ele descreve a estrutura estática de um sistema orientado a objetos ao mostrar as suas classes, atributos, métodos, modificadores de visibilidade e as relações entre os objetos, conforme apontado por Pressman e Maxim em 2021 e por Larman em 2005.

Diferente do Diagrama Entidade-Relacionamento, o DER, que foca na persistência passiva dos dados, o Diagrama de Classes representa entidades ativas de software contendo estado, representado pelos atributos, e comportamento, representado pelos métodos e operações, segundo Booch e colaboradores em 2012.

Torna explícitas as decisões de arquitetura e design de software, como o encapsulamento e a visibilidade, que determinam quais informações são privadas, protegidas ou públicas. Também evidencia a abstração e a herança ao permitir aplicar conceitos de generalização ou especialização, por exemplo com a classe base Usuario sendo estendida por Aluno e Profissional. Além disso, demonstra a distribuição de responsabilidades ao definir métodos específicos para manipular os atributos internos, como validações e regras de negócio.


Enquanto o Modelo de Dados foca nas tabelas, chaves primárias e estrangeiras do banco de dados relacional, o Diagrama de Classes traduz essa estrutura para o paradigma Orientado a Objetos. Atributos associativos ou tabelas intermediárias, como Treino Exercício, são mapeados como classes de associação ou entidades de domínio ricas em comportamento. Além disso, as chaves estrangeiras são substituídas por navegações diretas entre instâncias através de associações e multiplicidades, como fundamentado por Larman em 2005.


## 3.3 Topologia de rede e infraestrutura

O sistema MS Academia utiliza uma arquitetura cliente-servidor em estrela. Nessa estrutura, a topologia lógica é Cliente-Servidor, enquanto fisicamente a comunicação ocorre em uma estrutura em Estrela via internet/roteador.

O servidor hospeda o site e a lógica do sistema e concentra o processamento e os dados. O banco de dados armazena as informações de perfis e treinos.

Os três perfis de acesso — aluno, profissional e administrador — utilizam seus respectivos navegadores e conectam-se de forma independente ao mesmo servidor central. Essa organização segue o mesmo padrão de uma rede em estrela: se um cliente deixa de funcionar, os demais continuam funcionando normalmente.

Topologia légica inicial - Sistema da Academia

A escolha dessa topologia para o MS Academia faz sentido por três motivos principais:

A centralização dos dados, treinos, avaliações e conquistas de todos os alunos ficam armazenados em um único servidor, evitando duplicidade de informações e garantindo a consistência dos dados entre os três perfis de acesso.

O controle de acesso simplificado, como todos os clientes se comunicam

diretamente com o servidor, é fácil aplicar regras de acesso específicas para cada perfil aluno, profissional e administrador, centralizando o controle em um único ponto.

A escalabilidade e manutenção, novos alunos ou academias podem se conectar ao sistema sem a necessidade de alterar a estrutura da rede. Além disso, as atualizações são realizadas uma única vez no servidor, facilitando a manutenção do sistema.
