const Database = require("../src/config/Database");

// Testa a conexão com o banco de dados
describe("Database", () => {
  let db;
  beforeAll(() => {
    // Cria uma instância de Database
    db = new Database();
  });

  afterAll(async () => {
    // Fecha a conexão com o banco de dados
    await db.pool.end();
  });

  test("Testa a conexão com o banco de dados", async () => {
    // Testa a conexão com o banco de dados
    await expect(db.initialize()).resolves.toBeUndefined();
  });

  test("Teste de consulta com erros", async () => {
    // Testa uma consulta com erro
    const queryWithError = "SELECT * FROM tabela_inexistente;";
    // Verifica se a consulta com erro lança uma exceção
    await expect(db.query(queryWithError)).rejects.toThrow();
  });
});
