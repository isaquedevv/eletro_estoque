const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // coloque aqui a senha do seu MySQL, se houver
    port: 3306,
    database: 'eletro_estoque',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = conn;
