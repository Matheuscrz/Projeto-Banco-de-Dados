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
    await expect(db.initialize()).resolves.toBeUndefined();
  });

  test("Teste de consulta com erros", async () => {
    const queryWithError = "SELECT * FROM tabela_inexistente;";
    await expect(db.query(queryWithError)).rejects.toThrow();
  });
});
