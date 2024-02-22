const { Pool } = require("pg"); // Import Pool from pg

class Database {
  constructor() {
    this.user = process.env.DB_USER;
    this.host = process.env.DB_HOST;
    this.database = process.env.DB_DATABASE;
    this.password = process.env.DB_PASSWORD;
    this.port = process.env.DB_PORT;
    this.pool = new Pool({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      database: this.database,
    });
    // Inicializa testando conexão com o banco de dados
    this.initialize();
  }
  // Método para testar a conexão com o banco de dados
  async initialize() {
    let client;
    try {
      // Tenta conectar ao banco de dados
      client = await this.pool.connect();
      console.log("Conexão de teste ao banco de dados bem-sucedida!");
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados!", error);
    } finally {
      if (client) {
        // Fecha a conexão com o banco de dados
        client.release();
      }
    }
  }
  // Método para executar queries no banco de dados
  async query(query, params = []) {
    let client;
    try {
      // Tenta conectar ao banco de dados
      client = await this.pool.connect();
      // Executa a query
      const result = await client.query(query, params);
      // Retorna o resultado da query
      return result.rows;
    } catch (error) {
      console.error("Erro ao executar a query!", error);
      throw error;
    } finally {
      if (client) {
        // Fecha a conexão com o banco de dados
        client.release();
      }
    }
  }
}

module.exports = Database;
