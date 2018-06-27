const username = String(window.location.search.split('?')[1].split('=')[1]);
const onTripcard = String(window.location.search.split('?')[1].split('=')[2]);
var breezecard = [];

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

    $('#new-card-num').focus(function() {
        $('#wrong-card-num').hide();
    });

    $('#credit-card').focus(function() {
        $('#wrong-credit-card').hide();
    });

    $('#value').focus(function() {
        $('#limitation').hide();
    });

    var selectedCard;

    var selectedValue;

    var selectedRow;

    $('#breezecards').on('click', 'tr', function() {
        var $datatable = $('#breezecards').DataTable();

        selectedCard = $datatable.row(this).data()[0];

        selectedRow = $datatable.row(this);

        selectedValue = ($datatable.row(this).data()[1]).split('$')[1];

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#add-value-btn').prop('disabled', true);
        } else {
            $datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#add-value-btn').prop('disabled', false);
        }
    });



    $('#add-value-btn').click(function() {


        var result = validateCreditCardNum($('#credit-card').val());
        if(!result) {
            $('#wrong-credit-card').show();
            return;
        }

        var value = parseFloat($('#value').val());
        var currentValue = parseFloat(selectedValue);
        var total = value + currentValue;
        if(total <= 0 || total > 1000) {
            $('#limitation').show();
            return;
        }
        addValue(selectedCard, total, selectedRow);



    });

    getBreezecards();
    
});

var addValue = function(breezecardNum, value, selectedRow) {

    var url = 'http://localhost:8080/addValue';

    var payload = {
        'breezecardNum': breezecardNum,
        'value': value
    };

    $.ajax({
        type: 'POST',
        data: payload,
        url: url,

        success: function(result) {
            if(result == 'success') {
                changeValue(breezecardNum, value, selectedRow);
            }
            
        }
    });

};

var changeValue = function(breezecardNum, value) {
    var $datatable = $('#breezecards').DataTable();

    console.log(breezecardNum, value);

    $datatable.draw();


};

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
    breezecard = [];

    var array;
    for(var i = 0; i < data.length; i++){
        array = [];
        breezecard.push(data[i].BreezecardNum);
        array.push(data[i].BreezecardNum);
        array.push('$' + data[i].Value);
        array.push('Remove');
        $datatable.row.add(array);
    }
    $datatable.draw();
};

var tableAddNewValue = function(breezecardNum, value) {
    var $datatable = $('#breezecards').DataTable();
    var array = [];
    array.push(breezecardNum);
    array.push('$' + value);
    array.push('Remove');
    $datatable.row.add(array);

    $datatable.draw();

};

var updateBreezecardInView = function(breezecardNum, value) {
    breezecard.push(breezecardNum);
    tableAddNewValue(breezecardNum, value);
};

var addNewCard = function() {

    var breezecardNum = $('#new-card-num').val();
    
    var check = validateCardNum(breezecardNum);


    if (check) {
        var url = 'http://localhost:8080/addNewCard';
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                'breezecard': breezecardNum,
                'username': username
            },
            success: function(result) {

                if(result.message == 'Insert breezecard success'){
                    alert('Card inserted');
                    updateBreezecardInView(breezecardNum, result.value);
                } else if(result.message == 'Update breezecard'){
                    alert('Existing card added');
                    updateBreezecardInView(breezecardNum, result.value);
                } else {
                    alert(result.message);
                }
                $('#new-card-num').val('');
                $('#new-card-num').focus();
            }
        });
    }

};

var validateCreditCardNum = function(creditCardNum) {
    var pattern = new RegExp('^[0-9]{16}');

    var check = pattern.test(creditCardNum);

    if(creditCardNum == '' || !check) {
        return false;
    }
    return true;
};



var validateCardNum = function(breezecardNum) {

    var pattern = new RegExp('^[0-9]{16}');

    var check = pattern.test(breezecardNum);

    if(breezecardNum == '' || !check) {
        alert('Should be 16 digits');
        $('#new-card-num').val('');
        $('#new-card-num').focus();
        return false;
    }

    for(var i = 0; i < breezecard.length; i++) {
        if(breezecardNum == breezecard[i]) {
            alert('The card number is already belongs to this account!');
            $('#new-card-num').val('');
            $('#new-card-num').focus();
            return false;
        }
    }
    return true;

};