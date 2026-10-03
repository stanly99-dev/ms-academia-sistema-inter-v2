esse read.me serve como uma nota de como eu consegui chega aqui, e explica os meios que o sistema usa para fazer com que ele esteja online, que seu BD seja adulteravel via site e que possibilita a criacao de novas contas, facilitando o teste de usabilidade que me motivou a fazer essa grande mudança no sistema

so lembrando que estou usando ARCH linux e talvez nossas experiencias não sejam as mesmas ao lançar o servidor com o BD

qual mudança teve o sistema?: tentei deixar o sistema mais na pespectiva de um usuario novo possivel (pensando no teste de usabilidade) implementei a criacao, autenticacao e armazenamento(e seguranca) de novas contas e deixei alguns rastros no codigo da maneira mais fácil posssivel de criar um servidor online via node usando um pc (LocalTunnel)

requisitos
banco de dados: estou usando o dbeaver, onde criei uma nova conexão generico tipo mysql, nele criei um script e colei oque o pessoal de banco de dados nos mandou, assim a conexao se transformou no banco de dados que usaremos pra todo esse sistema

codificação: usei principalmente a IDE da google com o gemini, e o proprio gemini no navegador pra facilitar problemas, e fiz com que todo o trabalho deles fossem baseados no documento que vamos apresentar para os professores no inter
//////////////////////

servidor parte front: algumas partes de html foram alteradas, mas a grande maioria de todo o codigo de javascript foi auterado, tudo para permitir a logica da criacao e seguranca de contas, que ficam armazenadas no BD (inclusive, pelas senhas ficarem em hash nao podemos ver) e tambem em sessoes nos navegadores,

servidor parte back end: vamos la, a principio istalei o nodejs via terminal aonde baixei suas dependencias (pasta de node_modules) e lancei o servidor (node server.js) porem conforme a complexidade do projeto foi aumentando os arquivos javascript tbm foram, pois existem

um para se conectar diretamente com o banco de dados
(package-lock.json)

um para controlar que versao do sistema estamos usando
(package.json)

um para testar a conexão feita com o servidor nodejs
(db.js)

um (e o mais importante) para ser efetivamente o servidor nodejs
(server.js)

e um para juntar as funções do servidor e ser o cerébro do site
(der.js)


///////////////////////////////
inciando o servidor
(iniciar a conexao no dbeaver
iniciar a conexao no nodejs (node server,js))

(!o LocalTunnel ainda nao esta implementado)

!o LocalTunnel apenas expõe o conteudo no servidor node para a internet, como medida de segurança ele pede uma senha que somente o dono do servidor tem

!configuracao dbeaver, usuario tem o nome dev_user e senha 123321, eh importante usar essa senha pois os arquivos javascript estao configurados para funcionarem com ela
/////////////////////////////


