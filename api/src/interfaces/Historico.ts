/**
 * @interface Historico
 * @description Interface que representa uma DAO para o histórico de visualização de conteúdo
 */
export interface Historico {
  perfil: string;
  conteudo: string;
  dataVisualizacao: Date;
  progresso: number;
  status: boolean;
}
