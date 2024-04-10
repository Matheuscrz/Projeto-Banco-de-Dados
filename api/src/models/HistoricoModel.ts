import { Database } from "../config/Database";
import { Historico as HistoricoEntity } from "../interfaces/Historico";

/**
 * @class HistoricoModel
 * @description Classe responsável por realizar operações no banco de dados relacionadas ao histórico de visualização de conteúdo
 */
export class HistoricoModel {
  private static readonly TABLE_HISTORICO = "stream.historico";

  /**
   * @param perfil Identificador do perfil
   * @returns Retorna o histórico de visualização de conteúdo de um perfil
   * @throws Retorna um erro se não for possível buscar o histórico
   * @description Busca o histórico de visualização de conteúdo de um perfil
   */
  static async getHistoricoByPerfil(
    perfil: string
  ): Promise<HistoricoEntity | null> {
    try {
      const query = `SELECT * FROM ${this.TABLE_HISTORICO} WHERE perfil = $1`;
      const values = [perfil];
      const result = await Database.query(query, values);
      const historico = result.rows.length ? result.rows[0] : null;
      return historico;
    } catch (error) {
      throw new Error(`Erro ao buscar histórico.  Error: ${error}`);
    }
  }

  /**
   * @param historico Objeto do tipo Historico que representa o histórico de visualização de conteúdo
   * @returns Histórico de visualização de conteúdo criado
   * @throws Retorna um erro se não for possível criar o histórico
   * @description Cria um novo histórico de visualização de conteúdo
   */
  static async createHistorico(
    historico: HistoricoEntity
  ): Promise<HistoricoEntity> {
    try {
      const query = `
        INSERT INTO ${this.TABLE_HISTORICO} 
        (perfil, conteudo, progresso, status) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`;
      const values = [
        historico.perfil,
        historico.conteudo,
        historico.progresso,
        historico.status,
      ];
      const result = await Database.query(query, values);
      const newHistorico = result.rows.length ? result.rows[0] : null;
      return newHistorico;
    } catch (error) {
      throw new Error(`Erro ao criar histórico. Error: ${error}`);
    }
  }

  /**
   * @param historico Objeto do tipo Historico que representa o histórico de visualização de conteúdo
   * @returns Histórico de visualização de conteúdo atualizado
   * @throws Retorna um erro se não for possível atualizar o histórico
   * @description Atualiza o histórico de visualização de conteúdo
   */
  static async updateHistorico(
    historico: HistoricoEntity
  ): Promise<HistoricoEntity> {
    try {
      const query = `UPDATE ${this.TABLE_HISTORICO} SET "conteudo" = $1, "dataVisualizacao" = $2, "progresso" = $3, "status" = $4 WHERE "perfil" = $5 RETURNING *`;
      const values = [
        historico.conteudo,
        historico.dataVisualizacao,
        historico.progresso,
        historico.status,
        historico.perfil,
      ];
      const result = await Database.query(query, values);
      const updatedHistorico = result.rows.length ? result.rows[0] : null;
      return updatedHistorico;
    } catch (error) {
      throw new Error(`Erro ao atualizar histórico.  Error: ${error}`);
    }
  }

  /**
   * @param perfil Identificador do perfil
   * @returns Retorna um erro se não for possível deletar o histórico
   * @description Deleta o histórico de visualização de conteúdo de um perfil
   */
  static async deleteHistorico(perfil: string): Promise<void> {
    try {
      const query = `DELETE FROM ${this.TABLE_HISTORICO} WHERE perfil = $1`;
      const values = [perfil];
      await Database.query(query, values);
    } catch (error) {
      throw new Error(`Erro ao deletar histórico.  Error: ${error}`);
    }
  }
}
