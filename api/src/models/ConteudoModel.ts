import { Database } from "../config/Database";
import { Conteudo } from "../interfaces/Conteudo";

/**
 * Classe responsável por realizar a comunicação com o banco de dados
 * @class ConteudoModel
 */
export class ConteudoModel {
  private static readonly TABLE_CONTEUDO = "stream.conteudo"; // Nome da tabela no banco de dados

  /**
   * Método responsável por buscar um conteudo com base no id informado
   * @param id Identificador do conteudo
   * @returns Retorna um conteudo com base no id informado
   */
  static async getConteudoById(id: string): Promise<Conteudo | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE_CONTEUDO} WHERE id = $1`;
      const values = [id];
      const result = await Database.query(query, values);
      const conteudo = result.rows.length ? result.rows[0] : null;
      return conteudo;
    } catch (error) {
      throw new Error(`Erro ao buscar conteudo.  Error: ${error}`);
    }
  }

  /**
   * Método responsável por buscar um conteudo com base no titulo informado
   * @param Conteudo Objeto conteudo
   * @returns Retorna um conteudo com base no titulo informado
   */
  static async createConteudo(conteudo: Conteudo): Promise<Conteudo> {
    try {
      const query = `
        INSERT INTO ${this.TABLE_CONTEUDO}
        ("titulo", "descricao", "duracao", "dataLancamento", "videoPath")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        conteudo.titulo,
        conteudo.descricao,
        conteudo.duracao,
        conteudo.dataLancamento,
        conteudo.videoPath,
      ];
      const result = await Database.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar conteúdo. Error: ${error}`);
    }
  }

  /**
   * Método responsável por buscar todos os conteudos
   * @param conteudo Objeto conteudo
   * @returns Retorna o conteudo atualizado
   */
  static async updateConteudo(conteudo: Conteudo): Promise<Conteudo> {
    try {
      const query = `
        UPDATE ${this.TABLE_CONTEUDO}
        SET "titulo" = $1, "descricao" = $2, "duracao" = $3, "dataLancamento" = $4, "videoPath" = $5
        WHERE id = $6
        RETURNING *
      `;
      const values = [
        conteudo.titulo,
        conteudo.descricao,
        conteudo.duracao,
        conteudo.dataLancamento,
        conteudo.videoPath,
        conteudo.id,
      ];
      const result = await Database.query(query, values);
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar conteúdo. Error: ${error}`);
    }
  }

  /**
   * Método responsável por deletar um conteudo
   * @param id Identificador do conteudo
   */
  static async deleteConteudo(id: string): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE_CONTEUDO} WHERE id = $1`;
      const values = [id];
      await Database.query(query, values);
    } catch (error) {
      throw new Error(`Erro ao deletar conteúdo. Error: ${error}`);
    }
  }
}
