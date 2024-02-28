CREATE SCHEMA IF NOT EXISTS stream;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuário
CREATE TABLE IF NOT EXISTS stream.usuario(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Nome" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50) UNIQUE NOT NULL,
    "Senha" VARCHAR(50) NOT NULL,
    "CPF" VARCHAR(11) UNIQUE NOT NULL,
    "DataNascimento" DATE NOT NULL,
    "Created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
)
CREATE INDEX IF NOT EXISTS idx_usuario_email ON stream.usuario("Email"); -- Índice para busca por email

CREATE TYPE plano_type AS ENUM ('Mensal', 'Trimestral', 'Semestral', 'Anual'); -- Tipo de plano
-- Tabela de Plano
CREATE TABLE IF NOT EXISTS stream.plano(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Nome" VARCHAR(50) NOT NULL,
    "Tipo" plano_type NOT NULL,
    "Preco" FLOAT NOT NULL,
    "Descricao" VARCHAR(100),
    "NumeroDispositivos" INTEGER NOT NULL,
)
CREATE INDEX IF NOT EXISTS idx_plano_nome ON stream.plano("Nome"); -- Índice para busca por nome

-- Tabela de Assinatura
CREATE TABLE IF NOT EXISTS stream.assinatura(
    "id" UUID PRIMARY KEY REFERENCES stream.usuario(id), -- Chave estrangeira
    "Plano" UUID REFERENCES stream.plano(id), -- Chave estrangeira
    "Status" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Ativo, FALSE = Inativo
    "DataInicio" DATE NOT NULL DEFAULT CURRENT_DATE,
    "DataFim" DATE NOT NULL,
)
CREATE INDEX IF NOT EXISTS idx_assinatura_status ON stream.assinatura("Status"); -- Índice para busca por status

CREATE TYPE modalidade AS ENUM ('Crédito', 'Debito'); -- Tipo de modalidade
CREATE TYPE moeda AS ENUM ('BRL', 'USD', 'EUR', 'JPY', 'CNY', 'RUB', 'KRW', 'INR', 'GBP', 'AUD', 'CAD', 'CHF', 'HKD', 'SEK', 'NZD', 'SGD', 'NOK', 'MXN', 'ZAR', 'TRY', 'BRL'); -- Tipo de moeda
-- Tabela de Pagamento
CREATE TABLE IF NOT EXISTS stream.pagamento(
    "Assinatura" UUID PRIMARY KEY REFERENCES stream.assinatura(id), -- Chave estrangeira
    "Titular" VARCHAR(50) NOT NULL,
    "NumeroCartao" VARCHAR(16) NOT NULL,
    "CVC" VARCHAR(3) NOT NULL,
    "Validade" DATE NOT NULL,
    "Modalidade" modalidade NOT NULL,
    "Moeda" moeda NOT NULL,
    "DataPagamento" DATE NOT NULL DEFAULT CURRENT_DATE,
)

-- Tabela de Dispositivos
CREATE TABLE IF NOT EXISTS stream.dispositivo (
    "id" UUID REFERENCES stream.usuario(id), -- Chave estrangeira
    "Nome" VARCHAR(12) NOT NULL,
    "Modelo" VARCHAR(12) NOT NULL,
    "MAC" VARCHAR(12) NOT NULL,
    "Status" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Ativo, FALSE = Inativo
    "DataAutorizacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id", "MAC") -- Chave primária composta
);
CREATE INDEX IF NOT EXISTS idx_dispositivo_nome ON stream.dispositivo("Nome"); -- Índice para busca por nome

CREATE TYPE idioma_type AS ENUM ('pt-br', 'en-us', 'es-es', 'fr-fr', 'de-de', 'it-it', 'ja-jp', 'ko-kr', 'zh-cn', 'ru-ru'); -- Tipo de idioma
-- Tabela de Perfil
CREATE TABLE IF NOT EXISTS stream.perfil(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES stream.usuario(id), -- Chave estrangeira
    "Nome" VARCHAR(50) NOT NULL,
    "Image" BYTEA NOT NULL,
    "Idioma" idioma_type NOT NULL DEFAULT 'pt-br', -- Idioma padrão
    "Legenda" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Ativo, FALSE = Inativo
)
CREATE INDEX IF NOT EXISTS idx_perfil_nome ON stream.perfil("Nome"); -- Índice para busca por nome

-- Tabela de Playlist
CREATE TABLE IF NOT EXISTS stream.playlist(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "Nome" VARCHAR(50) NOT NULL,
    "Descricao" VARCHAR(100),
    "Created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("perfil_id", "Nome") -- Chave estrangeira composta
)

-- Tabela de Ator
CREATE TABLE IF NOT EXISTS stream.ator(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Nome" VARCHAR(50) PRIMARY KEY,
    "DataNascimento" DATE NOT NULL,
    "Biografia" VARCHAR(100),
    "Imagem" BYTEA
)

-- Tabela de Diretor
CREATE TABLE IF NOT EXISTS stream.diretor(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Nome" VARCHAR(50) PRIMARY KEY,
    "DataNascimento" DATE NOT NULL,
    "Biografia" VARCHAR(100),
    "Imagem" BYTEA
)

CREATE TYPE conteudo_genero AS ENUM ('Ação', 'Animação', 'Aventura', 'Comédia', 'Documentário', 'Drama', 'Ficção Científica', 'Musical', 'Romance', 'Suspense', 'Terror'); -- Tipo de gênero
CREATE TYPE conteudo_classificacao AS ENUM ('Livre', '10', '12', '14', '16', '18'); -- Tipo de classificação
-- Tabela de Conteúdo
CREATE TABLE IF NOT EXISTS stream.conteudo(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Titulo" VARCHAR(50) NOT NULL,
    "Descricao" VARCHAR(100),
    "Duracao" INTERVAL NOT NULL,
    "DataLancamento" DATE NOT NULL,
    "Genero" conteudo_genero ARRAY NOT NULL,
    "Classificacao" conteudo_classificacao NOT NULL DEFAULT 'Livre',
    "Idioma" idioma_type NOT NULL DEFAULT 'pt-br',
    "Legenda" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Possui Legenda, FALSE = Não Possui Legenda
    "Audio" idioma_type NOT NULL DEFAULT 'pt-br',
    "Ator" UUID REFERENCES stream.ator(id) ARRAY,
    "Diretor" UUID REFERENCES stream.diretor(id) ARRAY,
    "Imagem" BYTEA,
    "VideoPath" VARCHAR(100) NOT NULL,
    "Status" BOOLEAN NOT NULL DEFAULT TRUE -- TRUE = Disponível, FALSE = Indisponível 
)
CREATE INDEX IF NOT EXISTS idx_conteudo_titulo ON stream.conteudo("Titulo"); -- Índice para busca por título
CREATE INDEX IF NOT EXISTS idx_conteudo_genero ON stream.conteudo("Genero"); -- Índice para busca por gênero
CREATE INDEX IF NOT EXISTS idx_conteudo_classificacao ON stream.conteudo("Classificacao"); -- Índice para busca por classificação
CREATE INDEX IF NOT EXISTS idx_conteudo_data ON stream.conteudo("DataLancamento"); -- Índice para busca por data de lançamento

-- Tabela de Histórico
CREATE TABLE IF NOT EXISTS stream.historico(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataVisualizacao" DATE NOT NULL DEFAULT CURRENT_DATE,
    "Progresso" FLOAT NOT NULL DEFAULT 0.0,
    "Status" BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE = Visualizado, FALSE = Não Visualizado
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)
CREATE INDEX IF NOT EXISTS idx_historico_status ON stream.historico("Status"); -- Índice para busca por status

-- Tabela de Favorito
CREATE TABLE IF NOT EXISTS stream.favorito(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataFavorito" DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)

-- Tabela de Comentário
CREATE TABLE IF NOT EXISTS stream.comentario(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataComentario" DATE NOT NULL DEFAULT CURRENT_DATE,
    "Comentario" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)

-- Tabela de Avaliação
CREATE TABLE IF NOT EXISTS stream.avaliacao(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataAvaliacao" DATE NOT NULL DEFAULT CURRENT_DATE,
    "Avaliacao" FLOAT NOT NULL,
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)

-- Tabela de Recomendação
CREATE TABLE IF NOT EXISTS stream.recomendacao(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataRecomendacao" DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)

-- Tabela de Assistir Mais Tarde
CREATE TABLE IF NOT EXISTS stream.assistir_mais_tarde(
    "perfil_id" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "DataAdicionado" DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY ("perfil_id", "conteudo_id") -- Chave primária composta
)

-- Tabela de Filme
CREATE TABLE IF NOT EXISTS stream.filme(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "Sinopse" VARCHAR(100),
    "DataExibicao" DATE NOT NULL,
    "Premiacoes" VARCHAR(45) ARRAY,
    "Orçamento" DECIMAL,
    PRIMARY KEY ("conteudo_id") -- Chave primária composta
)

-- Tabela de Documentário
CREATE TABLE IF NOT EXISTS stream.documentario(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "Narrador" VARCHAR(50),
    "Entrevistados" VARCHAR(50) ARRAY,
    "Orçamento" DECIMAL,
    PRIMARY KEY ("conteudo_id") -- Chave primária composta
)

-- Tabela de Episódio
CREATE TABLE IF NOT EXISTS stream.episodio(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "Numero" INTEGER NOT NULL,
    "Subtitulo" VARCHAR(50),
    "Roteirista" VARCHAR(50),
    PRIMARY KEY ("conteudo_id", "Numero") -- Chave primária composta
)

-- Tabela de Temporada
CREATE TABLE IF NOT EXISTS stream.temporada(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "Numero" INTEGER NOT NULL,
    "DataLancamento" DATE NOT NULL,
    "Descricao" VARCHAR(100),
    "Orçamento" DECIMAL,
    PRIMARY KEY ("conteudo_id", "Numero") -- Chave primária composta
)

-- Tabela de Série
CREATE TABLE IF NOT EXISTS stream.serie(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "TituloOriginal" VARCHAR(50),
    "Sinopse" VARCHAR(100),
    "Genero" conteudo_genero ARRAY NOT NULL,
    "Classificacao" conteudo_classificacao NOT NULL DEFAULT 'Livre',
    "Temporadas" INTEGER NOT NULL,
    "Episodios" INTEGER NOT NULL,
    PRIMARY KEY ("conteudo_id") -- Chave primária composta
)

-- Tabela de Legenda
CREATE TABLE IF NOT EXISTS stream.legenda(
    "conteudo_id" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "Idioma" idioma_type NOT NULL,
    "Legenda" BYTEA NOT NULL,
    PRIMARY KEY ("conteudo_id", "Idioma") -- Chave primária composta
)
CREATE INDEX IF NOT EXISTS idx_legenda_idioma ON stream.legenda("Idioma"); -- Índice para busca por idioma