-- Atividade Programação de Aplicativos Mobile II
-- Aluno: Anthony Padovan - 3º B DS
-- Tema: Pokémon
-- Os votos abaixo são dados de exemplo para a atividade.

CREATE DATABASE IF NOT EXISTS pokemonbd
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE pokemonbd;

DROP TABLE IF EXISTS pokemon;

CREATE TABLE pokemon (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    votos INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO pokemon (nome, votos) VALUES
('Pikachu', 58),
('Charizard', 54),
('Greninja', 46),
('Eevee', 42),
('Lucario', 39);

SELECT * FROM pokemon ORDER BY votos DESC;
