create database if not exists crawler;

create table if not exists crawler.web(id BIGINT primary key auto_increment not null ,
  url varchar(500),
  header_date varchar(500),
  header_expires varchar(500),
  header_server varchar(500),
  header_connection varchar(500),
  header_vary varchar(500));