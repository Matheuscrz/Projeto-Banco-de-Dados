import { Database } from "../config/Database";
import { Perfil as PerfilEntity } from "../interfaces/Perfil";

/**
 * Classe responsável por realizar a comunicação com o banco de dados
 * @class PerfilModel
 */
export class PerfilModel {
  private static readonly TABLE_PERFIL = "stream.perfil"; // Nome da tabela no banco de dados

  /**
   * Método responsável por buscar um perfil com base no id informado
   * @param id - Identificador do perfil
   * @returns - Retorna um perfil com base no id informado
   */
  static async getPerfilById(id: string): Promise<PerfilEntity | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE_PERFIL} WHERE id = $1`;
      const values = [id];
      const result = await Database.query(query, values);
      const perfil = result.rows.length ? result.rows[0] : null;
      return perfil;
    } catch (error) {
      throw new Error(`Erro ao buscar perfil.  Error: ${error}`);
    }
  }

  /**
   * Método responsável por buscar um perfil com base no usuario informado
   * @param usuario Objeto usuario
   * @returns Retorna um perfil com base no usuario informado
   */
  static async getPerfilByUsuario(
    usuario: string
  ): Promise<PerfilEntity | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE_PERFIL} WHERE usuario = $1`;
      const values = [usuario];
      const result = await Database.query(query, values);
      const perfil = result.rows.length ? result.rows[0] : null;
      return perfil;
    } catch (error) {
      throw new Error(`Erro ao buscar perfil.  Error: ${error}`);
    }
  }

  /**
   * Método responsável por criar um perfil
   * @param perfil Objeto perfil
   * @returns Retorna um perfil criado
   */
  static async createPerfil(perfil: PerfilEntity): Promise<PerfilEntity> {
    try {
      const query = `
        INSERT INTO ${this.TABLE_PERFIL} 
        (usuario, nome, image) 
        VALUES ($1, $2, $3) 
        RETURNING *`;
      const values = [perfil.usuario, perfil.nome, null];
      const result = await Database.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar perfil.  Error: ${error}`);
    }
  }

  /**
   * Método responsável por atualizar um perfil
   * @param perfil Objeto perfil
   * @returns Retorna um perfil atualizado
   */
  static async updatePerfil(perfil: PerfilEntity): Promise<PerfilEntity> {
    try {
      const query = `UPDATE ${this.TABLE_PERFIL} SET "nome" = $1, "image" = $2 WHERE "id" = $3 RETURNING *`;
      const values = [perfil.nome, null, perfil.id];
      const result = await Database.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar perfil.  Error: ${error}`);
    }
  }

  /**
   * Método responsável por deletar um perfil
   * @param id Identificador do perfil
   */
  static async deletePerfil(id: string): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE_PERFIL} WHERE id = $1`;
      const values = [id];
      await Database.query(query, values);
    } catch (error) {
      throw new Error(`Erro ao deletar perfil.  Error: ${error}`);
    }
  }
}
