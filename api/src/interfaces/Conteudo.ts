import { idioma_type } from "./Perfil";

export interface Conteudo {
  id: string;
  titulo: string;
  descricao: string;
  duracao: number;
  dataLancamento: Date;
  genero: genero_type;
  classificacao: classificacao_type;
  idioma: idioma_type;
  legenda: boolean;
  audio: idioma_type;
  imagem: string;
  videoPath: string;
  status: boolean;
}

export type classificacao_type = "livre" | "10" | "12" | "14" | "16" | "18";
export type genero_type =
  | "acao"
  | "aventura"
  | "comedia"
  | "drama"
  | "terror"
  | "documentario"
  | "ficcao"
  | "musical"
  | "romance"
  | "suspense"
  | "policial"
  | "animacao"
  | "fantasia"
  | "historico"
  | "guerra"
  | "biografia"
  | "western"
  | "superherois"
  | "espionagem"
  | "esporte"
  | "musical"
  | "danca"
  | "eroticos"
  | "faroeste"
  | "mitologia"
  | "religioso"
  | "sobrenatural"
  | "tecnologia"
  | "viagem"
  | "zumbi"
  | "outros";
