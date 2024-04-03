import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * @class Database
 * @description Singleton para conexão com o banco de dados
 */
export class Database {
  private static pool: Pool;
  private static readonly user = process.env.DB_USER;
  private static readonly host = process.env.DB_HOST;
  private static readonly database = process.env.DB_DATABASE;
  private static readonly password = process.env.DB_PASSWORD;
  private static readonly port = process.env.DB_PORT || "5432";

  /**
   * @static
   * @throws {Error} Erro ao inicializar a conexão com o banco de dados
   * @memberof Database
   * @description Inicializa a conexão com o banco de dados
   */
  static initialize() {
    try {
      Database.pool = new Pool({
        user: Database.user,
        host: Database.host,
        database: Database.database,
        password: Database.password,
        port: parseInt(Database.port, 10),
      });
      Database.testConnection();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @static
   * @memberof Database
   * @throws {Error} Erro ao testar a conexão com o banco de dados
   * @description Testa a conexão com o banco de dados
   */
  private static async testConnection() {
    let client: PoolClient | null = null;
    try {
      client = await Database.pool.connect();
    } catch (error: any) {
      const errorMessage = "Erro ao testar a conexão com o banco de dados";
      throw new Error(errorMessage);
    } finally {
      try {
        if (client) {
          client.release();
        }
      } catch (releaseError: any) {
        const errorMessage = "Erro ao testar a conexão com o banco de dados";
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * @memberof Database
   * @param query Query a ser executada
   * @param params Parâmetros da query
   * @returns Resultado da query
   * @throws {Error} Erro ao executar a query
   * @description Executa uma query no banco de dados
   */
  static async query(query: string, params: any[] = []): Promise<QueryResult> {
    let client: PoolClient | null = null;
    try {
      client = await Database.pool.connect();
      return await client.query(query, params);
    } catch (error: any) {
      let errorMessage = "Erro ao executar a query";
      throw new Error(errorMessage);
    } finally {
      try {
        if (client) {
          client.release();
        }
      } catch (releaseError: any) {
        let errorMessage = "Erro ao liberar a conexão";
        throw new Error(errorMessage);
      }
    }
  }
}
Database.initialize();
