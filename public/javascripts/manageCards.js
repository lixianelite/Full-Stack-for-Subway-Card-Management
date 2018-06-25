const username = String(window.location.search.split('?')[1].split('=')[1]);

$(document).ready(function() {

    $('#wrong-credit-card').hide();
    $('#wrong-rm-msg').hide();
    $('#wrong-card-num').hide();
    $('#wrong-value').hide();
    $('#limitation').hide();
    $('#home').click(function() {
        window.location.href = `/passengerBreezecards.html?username=${username}`;
    });
    $('#add-new-card-btn').click(function() {
        addNewCard();
    });
    $('#new-card-num').focus(function(){
        $('#wrong-card-num').hide();
    });

    getBreezecards();
    
});

var getBreezecards = function(){

    var url = 'http://localhost:8080/breezecardNums';

    var payload = {
        'username': username
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: payload,
        success: function(result) {
            var data = JSON.parse(result.breezecardsInfo);

            console.log(data);

            drawTable(data);
        }
    });

};

var drawTable = function(data) {

    var $datatable = $('#breezecards').DataTable();
    $datatable.clear();

    var array;
    for(var i = 0; i < data.length; i++){
        array = [];
        array.push(data[i].BreezecardNum);
        array.push('$' + data[i].Value);
        array.push('Remove');
        $datatable.row.add(array);
    }
    $datatable.draw();
};

var addNewCard = function() {
    var breezecardNum = $('#new-card-num').val();

    var pattern = new RegExp('^[0-9]{16}');

    var check = pattern.test(breezecardNum);

    if(breezecardNum === '' || !check) {
        $('#wrong-card-num').show();
    } else{
        var url = 'http://localhost:8080/addNewCard';
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                'breezecard': breezecardNum,
                'username': username
            },
            success: function(result) {
                console.log(result);
            }
        });
    }

};