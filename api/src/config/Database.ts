import dotenv from "dotenv";
import { Pool, QueryResult } from "pg";

dotenv.config();

/**
 * Classe responsável por gerenciar a conexão com o banco de dados.
 * @class Database
 */
export class Database {
  private static pool: Pool;

  /**
   * Inicializa o pool de conexão com o banco de dados.
   * @private @method initializePool
   * @static initializePool
   * @memberof Database
   */
  private static initializePool() {
    if (!Database.pool) {
      Database.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || "5432", 10),
      });
      Database.pool.on("error", (err, client) => {
        console.error("Erro inesperado no banco de dados", err);
        process.exit(-1);
      });
      console.log("Pool de conexão com o banco de dados inicializado.");
    }
  }

  /**
   * Inicializa a conexão com o banco de dados.
   * @static initialize
   * @memberof Database
   */
  public static async initialize() {
    try {
      Database.initializePool();
      await Database.pool.query("SELECT NOW()");
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
    } catch (error) {
      console.error("Erro ao conectar com o banco de dados", error);
    }
  }

  /**
   * Executa uma query no banco de dados.
   * @param query - Query a ser executada
   * @param params - Parâmetros da query
   * @returns  - Resultado da query
   */
  public static async query(
    query: string,
    params: any[] = []
  ): Promise<QueryResult> {
    try {
      if (!Database.pool) {
        console.error("O pool de conexão não foi inicializado corretamente.");
        throw new Error("Pool de conexão não inicializado.");
      }
      const result = await Database.pool.query(query, params);
      return result;
    } catch (error) {
      console.error("Erro ao executar query:", error);
      throw error;
    }
  }

  /**
   * Encerra o pool de conexão com o banco de dados.
   * @static end
   * @memberof Database
   */
  public static async end() {
    try {
      if (Database.pool) {
        await Database.pool.end();
        console.log("Pool de conexão encerrado com sucesso.");
      } else {
        console.warn(
          "Tentativa de encerrar o pool, mas o pool não está inicializado."
        );
      }
    } catch (error) {
      console.error("Erro ao encerrar o pool de conexão:", error);
      throw error;
    }
  }
}

Database.initialize();
