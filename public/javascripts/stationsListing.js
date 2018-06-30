$(document).ready(function() {

    $('#home').click(function() {
        window.location.href = '/administrator.html';
    });

    var selectedID;

    $('#stations').on('click', 'tr', function() {
        var $datatable = $('#stations').DataTable();

        selectedID = $datatable.row(this).data()[1];

        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#view-station-btn').prop('disabled', true);
        }else{
            $datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#view-station-btn').prop('disabled', false);
        }

    });

    $('#view-station-btn').click(function() {
        window.location.href = '/viewStation.html?StopID='+selectedID;
    });

    $('#create-station-btn').click(function() {
        window.location.href='/newStation.html';
    });

    getStations();

});

var getStations = function() {
    
    var url = 'http://localhost:8080/getStations';

    $.ajax({
        type: 'GET',
        url: url,
        success: function(result) {
            var data = JSON.parse(result);
            console.log(data);
            drawTable(data);
        }
    });
};

var drawTable = function(data) {

    var $datatable = $('#stations').DataTable();

    $datatable.clear();

    var array;

    for(var i = 0; i < data.length; i++){
        array = [];
        array.push(data[i].Name);
        array.push(data[i].StopID);
        array.push(data[i].EnterFare);
        var status = data[i].ClosedStatus ? 'Closed' : 'Open';
        array.push(status);

        $datatable.row.add(array);
    }

    $datatable.draw();

};