$(document).ready(function() {

    $('#home').click(function() {
        window.location.href = '/administrator.html';
    });

    $('#update').click(function() {
        var opt = getFlowReportOption();
        getFlowReport(opt);
    });

    $('#reset').click(function() {
        $('#starttime').val('');
        $('#endtime').val('');
    });

    getFlowReport(getFlowReportOption());

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
            var data = JSON.parse(result);
            console.log(data);
            drawTable(data);
        }

    });
};

var drawTable = function(data) {
    var $datatable = $('#report').DataTable();

    $datatable.clear();

    var array;
    for(var i = 0; i < data.length; i++){
        array = [];
        array.push(data[i].Name);
        array.push(data[i].IsTrain);
        array.push(data[i].passengersIn);
        array.push(data[i].passengersOut);
        array.push(data[i].Flow);
        array.push(data[i].Tripfare);

        $datatable.row.add(array);
        
    }
    $datatable.draw();
};