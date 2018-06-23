const username = String(window.location.search.split('?')[1].split('=')[1]);

$(document).ready(function() {
    $('#progress').hide();

    $('#end').hide();

    $('#sel2').change(function() {
        getEndStations();
    });

    initialization();


});

var initialization = function() {
    getBreezecardNum();
    getStations();
};

var getBreezecardNum = function(){
    var url = 'http://localhost:8080/breezecardNums';
    var d = {
        'username': username
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function(result) {
            if(result != '') {
                console.log(result);
                var json = JSON.parse(result);
                console.log(json);
                for(var i = 0; i < json.length; i++) {
                    $('#sel1').append('<option>' + json[i].BreezecardNum + '</option>');
                    console.log(json[i].BreezecardNum);
                }
            }
        }
    });
};

var getStations = function() {
    var url = 'http://localhost:8080/stations';
    $.ajax({
        type: 'POST',
        url: url,
        success: function(result) {
            if(result != '') {
                var json = JSON.parse(result);
                for(var i = 0; i < json.length; i++) {
                    $('#sel2').append('<option>' + json[i].Name + ' - $' + json[i].EnterFare + '</option>');
                }
            }
        },
        complete: function() {
            getEndStations();
        }

    });
};

var getEndStations = function() {
    var station = $('#sel2').val();
    console.log(station);

    station = station.split(' - $')[0];
    
    var url = 'http://localhost:8080/endStations';

    var d = '&startsAt=' + station;

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function(data) {

            if(data.statusCode === 'OK') {
                var json = JSON.parse(data.body);
                $('#sel3').children().remove();
                for(var i = 0; i < json.length; i++) {
                    if(json[i].Name != station) {
                        $('#sel3').append('<option>' + json[i].Name + '</option>');
                    }
                }
            }
        }
    });

};

