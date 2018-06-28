const db = require('../databases/dbconnection');



module.exports.flowReport = function(req, res) {

    var startTime = req.query.startTime;
    var endTime = req.query.endTime;

    console.log(startTime);

    console.log(endTime);

};