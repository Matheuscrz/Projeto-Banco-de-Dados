-- Create schema
CREATE SCHEMA IF NOT EXISTS stream;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table stream."Dispositivo"
CREATE TABLE IF NOT EXISTS stream.dispositivo (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "MAC" VARCHAR(12) NOT NULL,
  "Nome" VARCHAR(45) NOT NULL,
  "Modelo" VARCHAR(45) NOT NULL,
  "Fabricante" VARCHAR(45),
  "Status" VARCHAR(45) NOT NULL,
  "Autorizacao" DATE,
  "Ultima_Atualizacao" DATE
);

CREATE TYPE Assinatura_Status AS ENUM ('Ativo', 'Cancelado');

-- Table stream."Assinatura"
CREATE TABLE IF NOT EXISTS stream.assinatura (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Status" Assinatura_Status NOT NULL DEFAULT 'Ativo',
  "Data_Inicio" DATE NOT NULL,
  "Data_Termino" DATE
);

-- Table stream."Usuario"
CREATE TABLE IF NOT EXISTS stream.usuario (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Nome" VARCHAR(50) NOT NULL,
  "CPF" VARCHAR(11) UNIQUE NOT NULL,
  "Email" VARCHAR(50) UNIQUE NOT NULL,
  "Senha" VARCHAR(45) NOT NULL,
  "Data_Nascimento" DATE NOT NULL,
  "Id_Dispositivo" UUID NOT NULL,
  "Id_Assinatura" UUID NOT NULL,
  "Created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("Id_Dispositivo") REFERENCES stream."dispositivo" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Id_Assinatura") REFERENCES stream."assinatura" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  UNIQUE ("Email", "CPF") 
);


-- Indexes for Usuario table
CREATE INDEX IF NOT EXISTS idx_usuario_email ON stream.usuario ("Email");
CREATE INDEX IF NOT EXISTS idx_usuario_cpf ON stream.usuario ("CPF");

-- Table stream."Playlist"
CREATE TABLE IF NOT EXISTS stream.playlist (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Nome" VARCHAR(45),
  "Descricao" TEXT,
  "Created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for Playlist table
CREATE INDEX IF NOT EXISTS idx_playlist_nome ON stream.playlist ("Nome");

CREATE TYPE idioma_type AS ENUM ('Português', 'Inglês', 'Espanhol', 'Francês', 'Outro');
CREATE TYPE legenda_type AS ENUM ('Português', 'Inglês', 'Espanhol', 'Francês', 'Outro');

-- Table stream."Perfil"
CREATE TABLE IF NOT EXISTS stream.perfil (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Nome" VARCHAR(45) NOT NULL,
  "Idioma" idioma_type ARRAY NOT NULL DEFAULT ARRAY['Português'::idioma_type], 
  "Legenda" legenda_type ARRAY DEFAULT ARRAY['Português'::legenda_type],
  "TB_USUARIO_EMAIL" VARCHAR(200) NOT NULL,
  "TB_USUARIO_CPF" VARCHAR(11) NOT NULL,
  "Playlist_ID_Playlist" UUID,
  FOREIGN KEY ("TB_USUARIO_EMAIL", "TB_USUARIO_CPF") REFERENCES stream."usuario" ("Email", "CPF") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Playlist_ID_Playlist") REFERENCES stream."playlist" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);


-- Indexes for Perfil table
CREATE INDEX IF NOT EXISTS idx_perfil_nome ON stream.perfil ("Nome");

CREATE TYPE Visualizacao_Status AS ENUM ('Assistido', 'Incompleto');
-- Table stream."Visualizacao"
CREATE TABLE IF NOT EXISTS stream.visualizacao (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Data" DATE NOT NULL,
  "Status" Visualizacao_Status NOT NULL DEFAULT 'Assistido',
  "Progresso" FLOAT,
  "Id_Perfil" UUID NOT NULL,
  FOREIGN KEY ("Id_Perfil") REFERENCES stream."perfil" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Visualizacao table
CREATE INDEX IF NOT EXISTS idx_visualizacao_status ON stream.visualizacao ("Status");

CREATE TYPE Conteudo_Genero AS ENUM ('Terror', 'Ação', 'Romance');
CREATE TYPE classificacao AS ENUM ('Livre', '10', '12', '14', '16', '18');

-- Table stream."Serie"
CREATE TABLE IF NOT EXISTS stream.serie (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Titulo" VARCHAR(45) NOT NULL,
  "Descricao" TEXT,
  "Genero" Conteudo_Genero ARRAY NOT NULL,
  "Classificacao_Indicativa" classificacao NOT NULL DEFAULT 'Livre'
);

-- Index for Serie table
CREATE INDEX IF NOT EXISTS idx_serie_titulo ON stream.serie ("Titulo");

-- Table stream."Conteudo"
CREATE TABLE IF NOT EXISTS stream.conteudo (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Titulo" VARCHAR(45) NOT NULL,
  "Descricao" TEXT,
  "Genero" Conteudo_Genero ARRAY NOT NULL,
  "Classificacao" classificacao NOT NULL DEFAULT 'Livre',
  "Data_Lancamento" DATE NOT NULL,
  "Idioma" idioma_type ARRAY NOT NULL DEFAULT ARRAY['Português'::idioma_type],
  "Legenda" legenda_type ARRAY DEFAULT ARRAY['Português'::legenda_type],
  "Ator" VARCHAR(45) ARRAY,
  "Diretor" VARCHAR(45) ARRAY,
  "Serie_ID_Conteudo" UUID NOT NULL,
  FOREIGN KEY ("Serie_ID_Conteudo") REFERENCES stream."serie" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Conteudo table
CREATE INDEX IF NOT EXISTS idx_conteudo_titulo ON stream.conteudo ("Titulo");

-- Table stream."Filme"
CREATE TABLE IF NOT EXISTS stream.filme (
  "Sinopse" TEXT,
  "Orcamento" FLOAT,
  "Premiacoes" VARCHAR(45),
  "Conteudo_ID_Conteudo" UUID PRIMARY KEY,
  FOREIGN KEY ("Conteudo_ID_Conteudo") REFERENCES stream."conteudo" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table stream."Documentario"
CREATE TABLE IF NOT EXISTS stream.documentario (
  "Tema" VARCHAR(45),
  "Narrador" VARCHAR(45),
  "Data_Producao" DATE,
  "Orcamento" FLOAT,
  "Entrevistado" VARCHAR(45),
  "Conteudo_ID_Conteudo" UUID PRIMARY KEY,
  FOREIGN KEY ("Conteudo_ID_Conteudo") REFERENCES stream."conteudo" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_documentario_tema ON stream.documentario ("Tema");

CREATE TYPE Status_Temporada AS ENUM ('Lançamento', 'Em Breve');
-- Table stream."Temporada"
CREATE TABLE IF NOT EXISTS stream.temporada (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Numero" INT NOT NULL,
  "Ano_Lancamento" INT,
  "Descricao" TEXT,
  "Status" Status_Temporada NOT NULL DEFAULT 'Em Breve',
  "Serie_Id" UUID NOT NULL,
  FOREIGN KEY ("Serie_Id") REFERENCES stream."serie" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table stream."Episodio"
CREATE TABLE IF NOT EXISTS stream.episodio (
  "Numero" INT NOT NULL,
  "Subtitulo" VARCHAR(45),
  "Sinopse" TEXT,
  "Roteirista" VARCHAR(45),
  "Ator" VARCHAR(45) ARRAY,
  "Conteudo_Id" UUID NOT NULL,
  "Temporada_Id" UUID NOT NULL,
  FOREIGN KEY ("Conteudo_Id") REFERENCES stream."conteudo" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Temporada_Id") REFERENCES stream."temporada" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table stream."Plano"
CREATE TABLE IF NOT EXISTS stream.plano (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Nome" VARCHAR(45) NOT NULL,
  "Tipo" VARCHAR(10) NOT NULL,
  "Preco" FLOAT NOT NULL,
  "Numero_Dispositivos" INT NOT NULL,
  "Id_Assinatura" UUID NOT NULL,
  FOREIGN KEY ("Id_Assinatura") REFERENCES stream."assinatura" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Plano table
CREATE INDEX IF NOT EXISTS idx_plano_nome ON stream.plano ("Nome");

CREATE TYPE Idioma_Legenda AS ENUM ('Português', 'Inglês', 'Espanhol', 'Francês', 'Outro');
-- Table stream."Legenda"
CREATE TABLE IF NOT EXISTS stream.legenda (
  "Idioma" Idioma_Legenda NOT NULL DEFAULT 'Português',
  "Path" VARCHAR(45) NOT NULL,
  "Conteudo_ID_Conteudo" UUID NOT NULL,
  "Conteudo_Serie_ID_Conteudo" UUID NOT NULL,
  PRIMARY KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo"),
  FOREIGN KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo") REFERENCES stream."conteudo" ("Id", "Serie_ID_Conteudo") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table stream."Produtora"
CREATE TABLE IF NOT EXISTS stream.produtora (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Nome" VARCHAR(45) NOT NULL,
  "Pais" VARCHAR(45),
  "Data_Fundacao" DATE
);

-- Index for Produtora table
CREATE INDEX IF NOT EXISTS idx_produtora_nome ON stream.produtora ("Nome");

-- Table stream."Produz"
CREATE TABLE IF NOT EXISTS stream.produz (
  "Conteudo_ID_Conteudo" UUID NOT NULL,
  "Conteudo_Serie_ID_Conteudo" UUID NOT NULL,
  "Produtora_ID_Produtora" UUID NOT NULL,
  PRIMARY KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo", "Produtora_ID_Produtora"),
  FOREIGN KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo") REFERENCES stream."conteudo" ("Id", "Serie_ID_Conteudo") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Produtora_ID_Produtora") REFERENCES stream."produtora" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Produz table
CREATE INDEX IF NOT EXISTS idx_produz_produtora ON stream.produz ("Produtora_ID_Produtora");

-- Table stream."Contem"
CREATE TABLE IF NOT EXISTS stream.contem (
  "Conteudo_ID_Conteudo" UUID NOT NULL,
  "Conteudo_Serie_ID_Conteudo" UUID NOT NULL,
  "Playlist_ID_Playlist" UUID NOT NULL,
  PRIMARY KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo", "Playlist_ID_Playlist"),
  FOREIGN KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo") REFERENCES stream."conteudo" ("Id", "Serie_ID_Conteudo") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Playlist_ID_Playlist") REFERENCES stream."playlist" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Contem table
CREATE INDEX IF NOT EXISTS idx_contem_playlist ON stream.contem ("Playlist_ID_Playlist");

-- Table stream."Avaliacao"
CREATE TABLE IF NOT EXISTS stream.avaliacao (
  "Perfil_ID_Perfil" UUID NOT NULL,
  "Conteudo_ID_Conteudo" UUID NOT NULL,
  "Conteudo_Serie_ID_Conteudo" UUID NOT NULL,
  "Visualizacao_ID_Visualizacao" UUID NOT NULL,
  "Data" DATE,
  "Classificacao" VARCHAR(2),
  "Comentario" TEXT,
  PRIMARY KEY ("Perfil_ID_Perfil", "Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo", "Visualizacao_ID_Visualizacao"),
  FOREIGN KEY ("Perfil_ID_Perfil") REFERENCES stream."perfil" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Conteudo_ID_Conteudo", "Conteudo_Serie_ID_Conteudo") REFERENCES stream."conteudo" ("Id", "Serie_ID_Conteudo") ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY ("Visualizacao_ID_Visualizacao") REFERENCES stream."visualizacao" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Index for Avaliacao table
CREATE INDEX IF NOT EXISTS idx_avaliacao_data ON stream.avaliacao ("Data");

CREATE TYPE modalidade AS ENUM ('Credito', 'Debito');
-- Table stream."Pagamento"
CREATE TABLE IF NOT EXISTS stream.pagamento (
  "Id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "Titular" VARCHAR(45) NOT NULL,
  "Numero_Cartao" VARCHAR(20) NOT NULL,
  "Validade" DATE NOT NULL,
  "CVC" SMALLINT NOT NULL,
  "Modalidade" modalidade NOT NULL DEFAULT 'Credito',
  "Id_Assinatura" UUID NOT NULL,
  FOREIGN KEY ("Id_Assinatura") REFERENCES stream."assinatura" ("Id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
