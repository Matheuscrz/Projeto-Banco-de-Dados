# Tutorial: Executando um Ambiente de Teste com `npm run dev`

Este tutorial fornecerá as etapas necessárias para configurar e executar um ambiente de teste local usando `npm run dev`. Certifique-se de ter o Node.js e o npm instalados em sua máquina antes de prosseguir.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [npm](https://www.npmjs.com/) (normalmente instalado automaticamente com o Node.js)

## Passos

### 1. Clone o Repositório

Clone o repositório do seu projeto para o seu ambiente local.

```bash
git clone https://github.com/Matheuscrz/Projeto-Banco-de-Dados.git
cd .\api\
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Execute em Ambiente de Desenvolvimento

```bash
npm run dev
```

### 4. Teste a API

Utilize ferramentas de teste API, como Postman ou Insomnia, para interagir com endpoints da API do seu projeto. Essas ferramentas são mais simples e intuitivas para testar requisições HTTP.

#### 1. Postman

- Crie uma rota do tipo POST com a url: http://localhost:3000/newUser
- Adicione dados na guia body, raw no formato json:

```bash
{
	"nome": "nome",
	"email": "email@gamil.com",
	"senha": "senha",
	"cpf": "00000000000",
	"dataNascimento": "0000-00-00"
}
```

- Envie a requisição e copie o id do resultado.
- Crie uma rota do tipo Get com a url: http://localhost:3000/user/idcopiado
- Envie a requisição
