export interface Perfil {
  id: string;
  usuario: string;
  nome: string;
  image: string;
  idioma: idioma_type;
  legenda: boolean;
}

export type idioma_type = "pt-br" | "en" | "es";
