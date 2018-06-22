const md5 = require('md5');
const db = require('../databases/dbconnection'); 
//const async = require('async');
//const co = require('co');
//const promisify = require('util').promisify;

const sql_select = 'SELECT * FROM Breezecard where BreezecardNum = ?;';
const sql_insert = 'INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo) Values(?, ?, ?);';
const sql_query_passenger_username = 'SELECT * FROM Passenger WHERE Username = ?;';
const sql_query_passenger_email = 'SELECT * FROM Passenger WHERE Email = ?;';

module.exports.register = function(req, res){
    var user = {
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'breeze_card_switch': req.body.breeze_card_switch,
        'breezecard_num': req.body.breezecard_num
    };

    
    Promise
        .all([checkUsername(user.username),
            checkEmail(user.email)])
        .then(function(results){
            if(results[0] && results[0]) {
                res.send({
                    'code': 200,
                    'statusCode': 'USERNAME_AND_EMAIL_ALREADY_EXIST',
                    'message': 'user name and email address already exist'
                }).end();
                throw new Error('abort promise chain');
            }else if(results[0]) {
                res.send({
                    'code': 200,
                    'statusCode': 'USERNAME_ALREADY_EXIST',
                    'message': 'user name already exist'
                }).end();
                throw new Error('abort promise chain');
            }else if(results[1]) {
                res.send({
                    'code': 200,
                    'statusCode': 'EMAIL_ALREADY_EXIST',
                    'message': 'Email address already exist'
                }).end();
                throw new Error('abort promise chain');
            }
        })
        .then(function(){
            console.log('should not executed');
        })
        .catch(function(err) {
            if (err.message === 'abort promise chain') {
                console.log('this is what I want');
            }
        });

};

function checkUsername(username) {
    return new Promise(function(resolve, reject){
        db.query(sql_query_passenger_username, username, 
            function(err, rows) {
                if (rows.length > 0) {
                    return resolve(true);
                }
                return resolve(false);
            });
    });
}

function checkEmail(Email, res) {
    return new Promise(function(resolve, reject) {
        db.query(sql_query_passenger_email, Email, 
            function(err, rows) {
                if (rows.length > 0) {
                    return resolve(true);
                }
                return resolve(false);
            });
    });
}



function getNewCard(username) {
    var card_number = randomString(16);

    db.query(sql_select, card_number, function(err, rows, fields) {
        if(rows.length > 0) {
            getNewCard(username);
        } else{
            console.log(card_number);
            db.query(sql_insert, [card_number, 0.0, username], function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    throw err;
                }
            });
        }

    });
}

function randomString(length) {
    var result = '';
    for(var i = 0; i < length; i++) {
        result += Math.floor((Math.random() * 10));
    }
    return result;
}
