import { Database } from "../config/Database";
import { Historico as HistoricoEntity } from "../interfaces/Historico";

export class HistoricoModel {
  private static readonly TABLE_HISTORICO = "stream.historico";

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

  static async createHistorico(
    historico: HistoricoEntity
  ): Promise<HistoricoEntity> {
    try {
      const query = `
        INSERT INTO ${this.TABLE_HISTORICO} 
        (perfil, conteudo, dataVisualizacao, progresso, status) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
      const values = [
        historico.perfil,
        historico.conteudo,
        historico.dataVisualizacao,
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
