# Tutorial: Execução `npm run dev`

Este tutorial fornecerá as etapas necessárias para configurar e executar um ambiente de teste local usando `npm run dev`. Certifique-se de ter o Node.js e o npm instalados em sua máquina antes de prosseguir.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [npm](https://www.npmjs.com/) (normalmente instalado automaticamente com o Node.js)

## Passos

### 1. Instale as Dependências

```bash
npm install
```

### 2. Execute a build

```bash
npm start
```

### 3. Teste a API

Utilize ferramentas de teste API, como Postman ou Insomnia, para interagir com endpoints da API do seu projeto. Essas ferramentas são mais simples e intuitivas para testar requisições HTTP.

#### 1. Postman

- Crie uma rota do tipo POST com a url: http://localhost:3000/newUser
- Adicione dados na guia body, raw no formato json:

```bash
{
	"nome": "nome",
	"email": "email@gmail.com",
	"senha": "senha",
	"cpf": "00000000000",
	"dataNascimento": "0000-00-00"
}
```

- Envie a requisição e copie o id do resultado.
- Crie uma rota do tipo Get com a url: http://localhost:3000/user/idcopiado ou http://localhost:3000/user-mail/emaildousuario
- Envie a requisição
