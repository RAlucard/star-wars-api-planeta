# Planetas Star Wars

Serviço de acesso a API externa SWAPI, para tratativa de planetas.

## Instalando
Baixar todas as dependências da API

```
npm install
```

## Configurando

O projeto utiliza arquivos de configurações que se encontram na pasta 'envs'.

Os arquivos são iniciados com '.env', onde o '.env' é carregado por padrão se não for especificado o NODE_ENV na inicialização.

Neste arquivo se encontra dados de configuração do servidor, de acessos ao banco de dados e da API externa do Star Wats.

__Lembrar de criar o arquivo .env.production ao colocar em produção__

## Inicializando

Executar o script start com o comando npm

```
npm start

ou

node server
```

### Dados sobre as chamadas da API

__GET /planet__
Listar todos os planetas

__GET /planet?name=__
Pesquisa pelo nome do planeta

__GET /planet/:id__
Pesquisa por id do planeta

__DELETE /planet/:id__
Apaga o planeta por seu id

__POST /planet__
Parâmetros esperados no cadastro: name, climate e terrain.

* No cadastro do planeta, o serviço acessa o swapi para verificar se este planeta existe no universo Star Wars, caso exista, o serviço guarda a informação de quantos filmes este planeta apareceu.


## Executando os testes

A execução dos testes depende da criação do arquivo de configuração .env.testing que deve apontar para uma base diferente da de produção/desenvolvimento, pois o teste se inicializa limpando a base de dados. (MongoDB)

```
npm test
ou
SET NODE_ENV=testing&& node node_modules/mocha/bin/mocha --recursive --timeout 15000
```

__Script de testes utilizando o padrão de execução no Windows__


### Informações sobre os testes

Os testes se iniciam com a limpeza do banco de dados


## Autor

* **Rafael Medeiros** - *Versão inicial*
