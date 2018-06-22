const md5 = require('md5');
const db = require('../databases/dbconnection');

exports.login = function(req, res) {
    //eslint-disable-next-line
    var sql = 'SELECT Username, Password, IsAdmin FROM User WHERE Username = ?;';

    var user = {
        'username' : req.body.username,
        'password' : req.body.password
    };

    console.log('username: '+ req.body.username);
    console.log('password: '+ req.body.password);

    db.query(sql, user.username, function(err, rows) {
        console.log('executed here');

        if(err) {
            console.error(err);
            throw err;
        }
        if (rows.length == 0) {
            res.send({
                'code': 200,
                'statusCode': 'NO_USER',
                'success': 'user does not exist'
            }).end();
            console.info('user does not exist');
            return;
        }
        var username = rows[0].Username;
        var password = rows[0].password;
        var IsAdmin = rows[0].IsAdmin ? 'TRUE' : 'FALSE';

        if (user.username == username && md5(user.password) == password) {
            res.send({
                'code': 200,
                'statusCode': 'OK',
                'isAdmin': IsAdmin,
                'success': 'login successful'
            });
            console.info('Login successfully');
        } else if(username == rows[0].Username && md5(user.password) != password) {
            res.send({
                'code': 200,
                'statusCode': 'WRONG_PASSWORD',
                'success': 'wrong password'
            });
            console.info('wrong password');
        }
        res.end();
    });
};