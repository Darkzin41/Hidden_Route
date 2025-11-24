create database hiddenroute;
use hiddenroute;
create table empresa (
  id int auto_increment primary key,
  nome_empresa varchar(100) not null,
  bairro varchar(100) not null,
  cnpj varchar(14) not null,
  avenida varchar(100) not null
);
