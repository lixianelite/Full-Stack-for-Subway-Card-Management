
var breezecards = [];
var conflictNum = [];


$(document).ready(function () {
    intiTable();

    $('#checkbox').prop('checked', true);

    $('#checkbox').click(function() {
        var filteredData = filterData();
        drawTable(filteredData);
    });

    $('#refresh').click(function() {
        var filteredData = filterData();
        drawTable(filteredData);
    });

    var selectedNum;

    $('#breezecards').on('click', 'tr', function(){
        var $datatable = $('#breezecards').DataTable();
        
        $datatable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        selectedNum = $datatable.row(this).data()[0];
    });

    $('#vbutton').click(function(e) {
        e.preventDefault();
        var value = $('#bvalue').val();

        if(value == '' || parseFloat(value) < 0 || parseFloat(value) > 1000) {
            alert('value should not be empty and within 0 to 1000');
            return;
        }
        changeCardValue(selectedNum, value);

    });

    $('#obutton').click(function(e) {
        e.preventDefault();
        var new_owner = $('#bowner').val();
        
        if(new_owner == '') {
            alert('the input cannot be empty');
            return;
        }
        transferCard(selectedNum, new_owner);
        
    });

});

var getOwnerByBreezecardNum = function(breezecardNum) {
    
    for(var i = 0; i < breezecards.length; i++){
        if(breezecards[i].BreezecardNum == breezecardNum) {
            return breezecards[i].BelongsTo;
        }
    }

    return null;

};


var transferCard = function(breezecardNum, new_owner) {

    var owner = getOwnerByBreezecardNum(breezecardNum);


    var url = 'http://localhost:8080/transfercard';

    var data = {
        'breezecardNum': breezecardNum,
        'owner': owner,
        'new_owner': new_owner
    };

    $.ajax({
        type: 'PUT',
        data: data,
        url: url,

        success: function(result) {
            console.log(result);
            if(result == 'OK') {
                intiTable();
                alert('Transfered success');
            }else{
                alert(result);
            }
        }
    });



};

var changeCardValue = function(breezecardNum, value) {

    var url = 'http://localhost:8080/updateBreezecardValue';

    var data = {
        'breezecardNum': breezecardNum,
        'value': value
    };

    $.ajax({
        type: 'PUT',
        url: url,
        data: data,
        success: function(result) {
            if(result == 'success') {
                intiTable();
            }
        }
    });
};




var intiTable = function() {

    var url = 'http://localhost:8080/getBreezecards';

    $.ajax({
        type: 'GET',
        url: url,

        success: function(result) {
            breezecards = JSON.parse(result.breezecards);
            conflictProcess(JSON.parse(result.conflictNum));
            var data = filterData();
            drawTable(data);

        }
    });
};

var conflictProcess = function(data) {

    conflictNum = [];
    for(var i = 0; i < data.length; i++) {
        conflictNum.push(data[i].BreezecardNum);
    }
};

var filterData = function() {

    var rawData = breezecards.slice();
    var filteredData = [];

    var check = $('#checkbox').prop('checked');
    filteredData = filterDataByCheck(rawData, check);

    var owner = $('#owner').val();
    filteredData = owner == '' ? filteredData : filterDataByBelongsTo(filteredData, owner);

    var cardNum = $('#cardnum').val();
    filteredData = cardNum == '' ? filteredData : filterDataByCardNum(filteredData, cardNum);

    var valueMin = $('#min').val();
    var valueMax = $('#max').val();
    filteredData = filterDataByRange(filteredData, valueMin, valueMax);

    return filteredData;
};

var filterDataByRange = function(rawData, min, max) {
    if(min == '' && max == '') {
        return rawData;
    }

    var filteredData = [];

    if(min != '' && max != '') {
        for(var i = 0; i < rawData.length; i++) {
            var cardValue = parseFloat(rawData[i].Value);
            if(cardValue >= parseFloat(min) && cardValue <= parseFloat(max)){
                filteredData.push(rawData[i]);
            }
        }
    }else if(min != '') {
        for(i = 0; i < rawData.length; i++) {
            cardValue = parseFloat(rawData[i].Value);
            if(cardValue >= parseFloat(min)) {
                filteredData.push(rawData[i]);
            }
        }
    }else if(max != '') {
        for(i = 0; i < rawData.length; i++) {
            cardValue = parseFloat(rawData[i].Value);
            if(cardValue <= parseFloat(max)) {
                filteredData.push(rawData[i]);
            }
        }
    }
    return filteredData;
};

var filterDataByBelongsTo = function(rawData, prop) {
    return rawData.filter(data => data.BelongsTo == prop);
};

var filterDataByCardNum = function(rawData, prop) {
    return rawData.filter(data => data.BreezecardNum == prop);
};

var filterDataByCheck = function(rawData, check) {

    var filteredData = [];

    if(check) {
        for(var i = 0; i < rawData.length; i++){
            var owner = conflictNum.indexOf(rawData[i].BreezecardNum) == -1 ?  rawData[i].BelongsTo : 'Suspended';
            var newData = Object.assign({}, rawData[i]);
            newData.BelongsTo = owner; 
            filteredData.push(newData);
        }
    }else{
        for(i = 0; i < rawData.length; i++){
            if(conflictNum.indexOf(rawData[i].BreezecardNum) == -1) {
                filteredData.push(rawData[i]);
            }
        }
    }

    return filteredData;
};


var drawTable = function(data) {

    var $datatable = $('#breezecards').DataTable();

    $datatable.clear();

    var array;

    for(var i = 0; i < data.length; i++){
        array = [];
        array.push(data[i].BreezecardNum);
        array.push(data[i].Value);
        array.push(data[i].BelongsTo);
        $datatable.row.add(array);
    }
    $datatable.draw();
};