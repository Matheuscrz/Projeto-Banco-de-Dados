CREATE SCHEMA IF NOT EXISTS stream;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuário
CREATE TABLE IF NOT EXISTS stream.usuario(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "senha" VARCHAR(200) NOT NULL,
    "cpf" VARCHAR(11) UNIQUE NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_usuario_email ON stream.usuario("email"); -- Índice para busca por email

CREATE TYPE plano_type AS ENUM ('Mensal', 'Trimestral', 'Semestral', 'Anual'); -- Tipo de plano
-- Tabela de Plano
CREATE TABLE IF NOT EXISTS stream.plano(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(50) NOT NULL,
    "tipo" plano_type NOT NULL,
    "preco" FLOAT NOT NULL,
    "descricao" VARCHAR(100),
    "numeroDispositivos" INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_plano_nome ON stream.plano("nome"); -- Índice para busca por nome

-- Tabela de Assinatura
CREATE TABLE IF NOT EXISTS stream.assinatura(
    "id" UUID PRIMARY KEY REFERENCES stream.usuario(id), -- Chave estrangeira
    "plano" UUID REFERENCES stream.plano(id), -- Chave estrangeira
    "status" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Ativo, FALSE = Inativo
    "dataInicio" DATE NOT NULL DEFAULT NOW(),
    "dataFim" DATE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assinatura_status ON stream.assinatura("status"); -- Índice para busca por status

CREATE TYPE modalidade AS ENUM ('Crédito', 'Debito'); -- Tipo de modalidade
CREATE TYPE moeda AS ENUM ('BRL', 'USD', 'EUR', 'JPY', 'CNY', 'RUB', 'KRW', 'INR', 'GBP', 'AUD', 'CAD', 'CHF', 'HKD', 'SEK', 'NZD', 'SGD', 'NOK', 'MXN', 'ZAR', 'TRY'); -- Tipo de moeda
-- Tabela de Pagamento
CREATE TABLE IF NOT EXISTS stream.pagamento(
    "assinatura" UUID PRIMARY KEY REFERENCES stream.assinatura(id), -- Chave estrangeira
    "titular" VARCHAR(50) NOT NULL,
    "numeroCartao" VARCHAR(16) NOT NULL,
    "cvc" VARCHAR(3) NOT NULL,
    "validade" DATE NOT NULL,
    "modalidade" modalidade NOT NULL,
    "moeda" moeda NOT NULL,
    "dataPagamento" DATE NOT NULL DEFAULT NOW()
);

-- Tabela de Dispositivos
CREATE TABLE IF NOT EXISTS stream.dispositivo (
    "id" UUID REFERENCES stream.usuario(id), -- Chave estrangeira
    "nome" VARCHAR(20) NOT NULL,
    "modelo" VARCHAR(12) NOT NULL,
    "mac" VARCHAR(20) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = Ativo, FALSE = Inativo
    "dataAutorizacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id", "mac") -- Chave primária composta
);
CREATE INDEX IF NOT EXISTS idx_dispositivo_nome ON stream.dispositivo("nome"); -- Índice para busca por nome

CREATE TYPE idioma_type AS ENUM ('pt-br', 'en-us', 'es-es', 'fr-fr', 'de-de', 'it-it', 'ja-jp', 'ko-kr', 'zh-cn', 'ru-ru'); -- Tipo de idioma
-- Tabela de Perfil
CREATE TABLE IF NOT EXISTS stream.perfil(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "usuario" UUID REFERENCES stream.usuario(id), -- Chave estrangeira
    "nome" VARCHAR(50) NOT NULL,
    "image" BYTEA,
    "idioma" idioma_type NOT NULL DEFAULT 'pt-br', -- Idioma padrão
    "legenda" BOOLEAN NOT NULL DEFAULT TRUE -- TRUE = Ativo, FALSE = Inativo
);
CREATE INDEX IF NOT EXISTS idx_perfil_nome ON stream.perfil("nome"); -- Índice para busca por nome

-- Tabela de Playlist
CREATE TABLE IF NOT EXISTS stream.playlist(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(100),
    "created_at" DATE NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("perfil", "nome") -- Chave estrangeira composta
);

-- Tabela de Ator
CREATE TABLE IF NOT EXISTS stream.ator(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(50),
    "dataNascimento" DATE NOT NULL,
    "biografia" VARCHAR(100),
    "imagem" BYTEA
);

-- Tabela de Diretor
CREATE TABLE IF NOT EXISTS stream.diretor(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "nome" VARCHAR(50),
    "dataNascimento" DATE NOT NULL,
    "biografia" VARCHAR(100),
    "imagem" BYTEA
);

CREATE TYPE conteudo_genero AS ENUM ('Ação', 'Animação', 'Aventura', 'Comédia', 'Documentário', 'Drama', 'Ficção Científica', 'Musical', 'Romance', 'Suspense', 'Terror'); -- Tipo de gênero
CREATE TYPE conteudo_classificacao AS ENUM ('Livre', '10', '12', '14', '16', '18'); -- Tipo de classificação
-- Tabela de Conteúdo
-- Tabela de Conteúdo
CREATE TABLE IF NOT EXISTS stream.conteudo(
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "titulo" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(100),
    "duracao" INTERVAL NOT NULL,
    "dataLancamento" DATE NOT NULL,
    "classificacao" conteudo_classificacao NOT NULL DEFAULT 'Livre',
    "idioma" idioma_type NOT NULL DEFAULT 'pt-br',
    "legenda" BOOLEAN NOT NULL DEFAULT TRUE,
    "audio" idioma_type NOT NULL DEFAULT 'pt-br',
    "imagem" BYTEA,
    "videoPath" VARCHAR(100) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_conteudo_titulo ON stream.conteudo("titulo");
CREATE INDEX IF NOT EXISTS idx_conteudo_genero ON stream.conteudo("genero");
CREATE INDEX IF NOT EXISTS idx_conteudo_classificacao ON stream.conteudo("classificacao");
CREATE INDEX IF NOT EXISTS idx_conteudo_data ON stream.conteudo("dataLancamento");

-- Tabela de Relacionamento Conteudo_Ator
CREATE TABLE IF NOT EXISTS stream.conteudo_ator_rel (
    "conteudo" UUID REFERENCES stream.conteudo(id),
    "ator" UUID REFERENCES stream.ator(id),
    PRIMARY KEY ("conteudo", "ator")
);

-- Tabela de Relacionamento Conteudo_Diretor
CREATE TABLE IF NOT EXISTS stream.conteudo_diretor_rel (
    "conteudo" UUID REFERENCES stream.conteudo(id),
    "diretor" UUID REFERENCES stream.diretor(id),
    PRIMARY KEY ("conteudo", "diretor")
);
-- Tabela de Histórico
CREATE TABLE IF NOT EXISTS stream.historico(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataVisualizacao" DATE NOT NULL DEFAULT NOW(),
    "progresso" FLOAT NOT NULL DEFAULT 0.0,
    "status" BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE = Visualizado, FALSE = Não Visualizado
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);
CREATE INDEX IF NOT EXISTS idx_historico_status ON stream.historico("status"); -- Índice para busca por status

-- Tabela de Favorito
CREATE TABLE IF NOT EXISTS stream.favorito(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataFavorito" DATE NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);

-- Tabela de Comentário
CREATE TABLE IF NOT EXISTS stream.comentario(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataComentario" DATE NOT NULL DEFAULT NOW(),
    "comentario" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);

-- Tabela de Avaliação
CREATE TABLE IF NOT EXISTS stream.avaliacao(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataAvaliacao" DATE NOT NULL DEFAULT NOW(),
    "avaliacao" FLOAT NOT NULL,
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);

-- Tabela de Recomendação
CREATE TABLE IF NOT EXISTS stream.recomendacao(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataRecomendacao" DATE NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);

-- Tabela de Assistir Mais Tarde
CREATE TABLE IF NOT EXISTS stream.assistir_mais_tarde(
    "perfil" UUID REFERENCES stream.perfil(id), -- Chave estrangeira
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "dataAdicionado" DATE NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("perfil", "conteudo") -- Chave primária composta
);

-- Tabela de Filme
CREATE TABLE IF NOT EXISTS stream.filme(
    "conteudo" UUID PRIMARY KEY REFERENCES stream.conteudo(id), -- Chave estrangeira
    "sinopse" VARCHAR(100),
    "dataExibicao" DATE NOT NULL,
    "premiacoes" VARCHAR(45) ARRAY,
    "orçamento" DECIMAL
);

-- Tabela de Documentário
CREATE TABLE IF NOT EXISTS stream.documentario(
    "conteudo" UUID PRIMARY KEY REFERENCES stream.conteudo(id), -- Chave estrangeira
    "narrador" VARCHAR(50),
    "entrevistados" VARCHAR(50) ARRAY,
    "orçamento" DECIMAL
);

-- Tabela de Episódio
CREATE TABLE IF NOT EXISTS stream.episodio(
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "numero" INTEGER NOT NULL,
    "subtitulo" VARCHAR(50),
    "roteirista" VARCHAR(50),
    PRIMARY KEY ("conteudo", "numero") -- Chave primária composta
);

-- Tabela de Temporada
CREATE TABLE IF NOT EXISTS stream.temporada(
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "numero" INTEGER NOT NULL,
    "dataLancamento" DATE NOT NULL,
    "descricao" VARCHAR(100),
    "orçamento" DECIMAL,
    PRIMARY KEY ("conteudo", "numero") -- Chave primária composta
);

-- Tabela de Série
CREATE TABLE IF NOT EXISTS stream.serie(
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "tituloOriginal" VARCHAR(50),
    "sinopse" VARCHAR(100),
    "genero" conteudo_genero ARRAY NOT NULL,
    "classificacao" conteudo_classificacao NOT NULL DEFAULT 'Livre',
    "temporadas" INTEGER NOT NULL,
    "episodios" INTEGER NOT NULL,
    PRIMARY KEY ("conteudo") -- Chave primária composta
);

-- Tabela de Legenda
CREATE TABLE IF NOT EXISTS stream.legenda(
    "conteudo" UUID REFERENCES stream.conteudo(id), -- Chave estrangeira
    "idioma" idioma_type NOT NULL,
    "legenda" BYTEA NOT NULL,
    PRIMARY KEY ("conteudo", "idioma") -- Chave primária composta
);
CREATE INDEX IF NOT EXISTS idx_legenda_idioma ON stream.legenda("idioma"); -- Índice para busca por idioma