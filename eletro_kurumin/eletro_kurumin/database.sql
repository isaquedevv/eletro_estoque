CREATE DATABASE IF NOT EXISTS eletro_estoque
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eletro_estoque;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS componente (
  id_componente INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  id_usuario INT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  quantidade_estoque INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_componente_categoria FOREIGN KEY (id_categoria)
    REFERENCES categoria(id_categoria),
  CONSTRAINT fk_componente_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS movimentacao (
  id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
  id_componente INT NOT NULL,
  id_usuario INT NULL,
  data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo ENUM('entrada','saida') NOT NULL,
  quantidade INT NOT NULL,
  justificativa TEXT,
  CONSTRAINT fk_movimentacao_componente FOREIGN KEY (id_componente)
    REFERENCES componente(id_componente),
  CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

INSERT INTO categoria (nome, descricao)
SELECT 'Resistores', 'Componentes resistivos'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Resistores');

INSERT INTO categoria (nome, descricao)
SELECT 'Capacitores', 'Componentes capacitivos'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Capacitores');

INSERT INTO categoria (nome, descricao)
SELECT 'Semicondutores', 'LEDs, diodos e transistores'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Semicondutores');
