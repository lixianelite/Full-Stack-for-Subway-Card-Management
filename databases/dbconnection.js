const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lixianelite',
    database: 'marta'
});

module.exports = connection;



