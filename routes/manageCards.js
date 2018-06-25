const db = require('../databases/dbconnection');





module.exports.addNewBreezecard = function(req, res) {
    var body = req.body;

    console.log(body);

    console.log(body.username);
    console.log(body.breezecard);

    res.send('ok').end();




};