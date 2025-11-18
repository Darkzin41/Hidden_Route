-- Instale o Banco de Dados e rode esse comando para criar o banco de dados da sua aplicaçao

DROP database mydatabase;
CREATE database mydatabase;
USE mydatabase;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL,
    perfil VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);