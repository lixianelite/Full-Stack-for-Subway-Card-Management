$(document).ready(function() {


    $('#home').click(function() {
        window.location.href = '/administrator.html';
    });

    $('#update').click(function() {
        var opt = getFlowReportOption();
        getFlowReport(opt);
    });

});

var getFlowReportOption = function() {

    var startTime = $('#starttime').val();
    var endTime = $('#endtime').val();

    var opt = {
        'startTime': startTime,
        'endTime': endTime
    };
    return opt;
};

var getFlowReport = function(opt) {

    var url = 'http://localhost:8080/flowReport';

    $.ajax({
        type: 'GET',
        url: url,
        data: opt,
        success: function(result) {

            console.log(result);

        }

    });



};