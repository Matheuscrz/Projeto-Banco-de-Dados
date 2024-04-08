import { idioma_type } from "./Perfil";

export interface Conteudo {
  id?: string;
  titulo: string;
  descricao: string;
  duracao: number;
  dataLancamento: Date;
  classificacao?: classificacao_type;
  idioma?: idioma_type;
  legenda?: boolean;
  audio?: idioma_type;
  imagem?: string;
  videoPath: string;
  status?: boolean;
}

export type classificacao_type = "Livre" | "10" | "12" | "14" | "16" | "18";
