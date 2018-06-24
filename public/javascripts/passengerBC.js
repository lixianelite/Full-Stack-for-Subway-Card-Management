
const username = String(window.location.search.split('?')[1].split('=')[1]);

var cardInfo = [];

$(document).ready(function() {

    htmlBehaviorSetup();

    initialization();

});

var htmlBehaviorSetup = function() {
    $('#progress').hide();

    $('#end').hide();

    $('#sel2').change(function() {
        getEndStations();
    });

    $('#sel1').change(function() {
        getBalance();
    });

    $('#start').click(function() {
        startTrip();
    });

    $('#end').click(function() {
        endTrip();
    });

    $('#view-trip-btn').click(function() {
        window.location.href = `/tripHistory.html?username=${username}`;
    });
};

var initialization = function() {
    var promise = getBreezecardNums();
    
    promise.then(function(result) {
        if(result == true) getStations();
    });
};



var getBreezecardNums = function(){
    var url = 'http://localhost:8080/breezecardNums';
    var d = {
        'username': username
    };

    return new Promise(function(resolve) { 
        $.ajax({
            type: 'POST',
            url: url,
            data: d,
            success: function(result) {
                if(result.breezecardsInfo != '') {
                    console.log(result);
                    var json = JSON.parse(result.breezecardsInfo);
                    cardInfo = json;
                    for(var i = 0; i < json.length; i++) {
                        $('#sel1').append('<option>' + json[i].BreezecardNum + '</option>');
                    }
                }
                if(result.tripInfo != '') {
                    var returnedTripInfo = JSON.parse(result.tripInfo);
                    setUpOntripInfo(returnedTripInfo);
                    return resolve(false);
                }
                return resolve(true);
            }
        });
    });
};

var setUpOntripInfo = function(tripInfo) {
    $('#start').hide();
    $('#progress').show();

    var station = tripInfo[0].IsTrain ? tripInfo[0].Name + '(Train)' : tripInfo[0].Name + '(Bus)';
    var info = station + ' - $' + tripInfo[0].EnterFare;

    $('#sel1').val(tripInfo[0].BreezecardNum);
    $('#sel1').prop('disabled', true);

    $('#sel2').append('<option>' + info + '</option>');
    $('#sel2').prop('disabled', true);
    $('#end').show();

    getEndStations();
    getBalance();

};

var getStations = function() {
    var url = 'http://localhost:8080/stations';
    $.ajax({
        type: 'POST',
        url: url,
        success: function(result) {
            if(result != '') {
                var json = JSON.parse(result);
                $('#sel2').children().remove();
                for(var i = 0; i < json.length; i++) {
                    var stationName = json[i].IsTrain == '1' ? json[i].Name + '(Train)' : json[i].Name + '(Bus)';
                    $('#sel2').append('<option>' + stationName+ ' - $' + json[i].EnterFare + '</option>');
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
    if(station == undefined) {
        return;
    }
    station = station.split(' - $')[0];

    var index = station.search(/\(.*\)/);

    var stationName = station.substring(0, index);
    var type = station.substring(index + 1, station.length - 1);

    
    var url = 'http://localhost:8080/endStations';

    var payload = {
        'stationName': stationName,
        'type': type
    };

    var d = JSON.stringify(payload);

    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: d,
        success: function(data) {

            if(data.statusCode === 'OK') {
                var json = JSON.parse(data.body);
                $('#sel3').children().remove();
                for(var i = 0; i < json.length; i++) {
                    $('#sel3').append('<option>' + json[i].Name + '</option>');
                }
            }
        }
    });

};

var getBalance = function() {

    var cardNum = $('#sel1 :selected').val();
    if(cardNum === 'Select Breezecard'){
        $('#balance').hide();
        return;
    }

    var value = 0.0;
    for(var i = 0; i < cardInfo.length; i++) {
        if (cardInfo[i].BreezecardNum === cardNum) {
            value = cardInfo[i].Value;
            $('#balance').text('$ ' + parseFloat(value).toFixed(2));
            $('#balance').show();
            break;
        }
    }
};

var startTrip = function() {
    var str = $('#sel2').val();
    var splitStartStation = str.split(' - $');

    var cardNum = $('#sel1').val();
    var pattern = new RegExp('^[0-9]{16}');

    if(!pattern.test(cardNum)) {
        alert('Choose a Breezecard!');
        return;
    }

    var station = splitStartStation[0];
    var tripFare = splitStartStation[1];

    var index = station.search(/\(.*\)/);
    var stationName = station.substring(0, index);
    var type = station.substring(index + 1, station.length - 1);

    var url = 'http://localhost:8080/startTrip';

    var value = ($('#balance').text().split(' '))[1];
    var balance = parseFloat(value) - parseFloat(splitStartStation[1]);

    if(balance < 0) {
        alert('You donnot have enough balance to start a trip');
        return;
    }

    var opt = {
        'cardNum': cardNum,
        'startsAt': stationName,
        'type': type,
        'tripFare': tripFare,
        'balance': balance
    };

    var info = JSON.stringify(opt);

    $.ajax({
        url: url,
        data: info,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function(result) {
            if(result.statusCode === 'START_TRIP') {
                $('#start').hide();
                $('#progress').show();
                $('#end').show();
                $('#sel1').prop('disabled', true);
                $('#sel2').prop('disabled', true);
            }
        },
        complete: function() {
            updateBalance(cardNum, balance);
        }
    });
};

var endTrip = function() {

    var breezecardNum = $('#sel1').val();

    var endStation = $('#sel3').val();

    if(endStation == undefined || endStation == ''){
        alert('Please select an end station!');
        return;
    }

    var str = $('#sel2').val();
    var splitStartStation = str.split(' - $');
    var station = splitStartStation[0];
    var index = station.search(/\(.*\)/);
    var type = station.substring(index + 1, station.length - 1);


    var data = {
        'breezecardNum': breezecardNum,
        'type': type,
        'endStation': endStation
    };

    var url = 'http://localhost:8080/endTrip';

    var payload = JSON.stringify(data);

    console.log(payload);

    $.ajax({
        url: url,
        data: payload,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function(result) {
            if(result.statusCode === 'TRIP_END') {
                $('#start').show();
                $('#progress').hide();
                $('#end').hide();
                $('#sel1').prop('disabled', false);
                $('#sel2').prop('disabled', false);
                getStations();
            }
        }
    });

};

var updateBalance = function(cardNum, balance) {
    for(var i = 0; i < cardInfo.length; i++){
        if(cardInfo[i].BreezecardNum == cardNum) {
            cardInfo[i].Value = balance;
            break;
        }
    }
    $('#balance').text('$ ' + parseFloat(balance).toFixed(2));
    $('#balance').show();
};



