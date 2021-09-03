const mysql = require('mysql');

const connection =  mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'crawler',
        port: 32768
    });

connection.connect(function(err){
    if(err){
        console.error(err);
    }else{
        console.log('db connection done');
    }
});

 connection.query('create database if not exists crawler', (err, rows, fields) =>{
    if(err){
        throw err;
    }else{
       connection.query('create table if not exists crawler.web(id BIGINT primary key auto_increment not null ,url varchar(1000),header_date varchar(500), header_expires varchar(500), header_server varchar(500),header_connection varchar(500),header_vary varchar(500));', (err, rows, fields) =>{
            if(err) throw err;
        });
    }
});

module.exports = connection;
