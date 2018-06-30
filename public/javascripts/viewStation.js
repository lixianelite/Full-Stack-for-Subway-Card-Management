var stopID = window.location.search.split('?')[1].split('=')[1];

$(document).ready(function() {
    $('#stopid').text(stopID);
    $('#home').click(function() {
        window.location.href = './stationsList.html';
    });

    $('#fare').focus(function() {
        $('#errormessage').hide();
    });

    $('#update').click(function() {
        var fare = $('#fare').val();

        if(fare == '') {
            $('#errormessage').text('Please provide a fare');
            $('#errormessage').show();
        }else if(Number(fare) < 0 || Number(fare) > 50) {
            $('#errormessage').text('Fare out of range, should between 0 and 50');
            $('#errormessage').show();
        } else{
        
            updateFare(Number(fare));
        }
    });

    $('#check').click(function() {
        var val = $('#check').prop('checked') == true;
        updateStatus(val);
    });


    getStationById(stopID);

});

var updateStatus = function(status) {
    var url = 'http://localhost:8080/updateStatus';

    var data = {
        'stopID': stopID,
        'status': status
    };

    $.ajax({
        type: 'PUT',
        url: url,
        data: data,

        success: function(result) {
            if(result == 'success') {
                alert('Station status updated');
            }
        }
    });

};

var updateFare = function(fare) {
    var url = 'http://localhost:8080/updateFare';

    var data = {
        'fare': fare,
        'StopID': stopID
    };

    $.ajax({
        type: 'PUT',
        url: url,
        data: data,

        success: function(result) {
            if(result === 'Success') {
                alert('Fare updated success!');
            }
        }
    });
};

var getStationById = function(stopID) {

    var url = 'http://localhost:8080/getStations/' + stopID;

    $.ajax({
        type: 'GET',
        url: url,

        success: function(result) {

            var stationInfo = result.stationInfo;

            var data = JSON.parse(stationInfo);

            var intersection = result.intersectionInfo;

            console.log('intersection: ' + intersection);

            console.log('data name: ' + data.Name);

            viewRender(data, intersection);
        }

    });
};


var viewRender = function(stationInfo, intersection) {
    $('h1').text(String(stationInfo.Name));

    if(stationInfo.ClosedStatus === 0) {
        $('#check').prop('checked', true);
    } else{
        $('#check').prop('checked', false);
    }

    if(stationInfo.IsTrain === 1) {
        $('#intersection').text('Not applicable for train station');
    }else{
        $('#intersection').text(intersection);
    }

    $('#fare').attr('placeholder', '$' + parseFloat(stationInfo.EnterFare, 10).toFixed(2));

};

