var queryParams = window.location.search.split('?')[1];

const username = String(queryParams.split('&')[0].split('=')[1]);

const onTripcard = String(queryParams.split('&')[1].split('=')[1]);

var breezecard = [];

$(document).ready(function() {

    $('#wrong-credit-card').hide();
    $('#wrong-rm-msg').hide();
    $('#wrong-card-num').hide();
    $('#wrong-value').hide();
    $('#limitation').hide();

    console.log('window: ' + window.location.search);

    console.log('on trip card: ' + onTripcard);

    
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

    $('#breezecards').on('click', 'tr', function() {
        var $datatable = $('#breezecards').DataTable();

        selectedCard = $datatable.row(this).data()[0];

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

    $('#breezecards').on('click', 'td', function() {
        var $datatable = $('#breezecards').DataTable();

        selectedCard = $datatable.row(this).data()[0];

        if($datatable.cell(this).data() == 'Remove') {
            if($datatable.rows().count() <= 1) {
                alert('You cannot remove the last card');
                return;
            }

            if(selectedCard == onTripcard) {
                alert('You cannot remove on trip card');
                return;
            }
            removeBreezecard(selectedCard);
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
        addValue(selectedCard, total);
    });

    getBreezecards();
    
});


var removeBreezecard = function(selectedCard) {
    var url = 'http://localhost:8080/removecard';

    var payload = {
        'breezecardNum': selectedCard
    };

    console.log('breezecard:' + selectedCard);

    $.ajax({
        type: 'POST',
        data: payload,
        url: url,

        success: function(result) {
            if(result == 'success') {
                deleteData(selectedCard);
                drawTable();
            }
        }

    });

};

var addValue = function(breezecardNum, value) {

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
                changeValue(breezecardNum, value);
            }
            
        }
    });

};

var changeValue = function(breezecardNum, value) {

    console.log(breezecardNum, value);

    updateData(breezecardNum, value);

    drawTable();

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

            loadData(data);
            drawTable();
        }
    });

};

var loadData = function(data) {

    breezecard = [];

    for(var i = 0; i < data.length; i++){
        breezecard.push({
            'breezecardNum': data[i].BreezecardNum,
            'value': data[i].Value
        });
    }
};

var updateData = function(breezecardNum, value) {

    for(var i = 0; i < breezecard.length; i++) {
        if(breezecard[i].breezecardNum == breezecardNum) {
            breezecard[i].value = value;
            break;
        }
    }
};

var deleteData = function(breezecardNum) {

    for(var i = 0; i < breezecard.length; i++) {
        if(breezecard[i].breezecardNum == breezecardNum) {
            breezecard.splice(i, 1);
            return;
        }
    }

};

var drawTable = function() {

    var $datatable = $('#breezecards').DataTable();
    $datatable.clear();

    var array;
    for(var i = 0; i < breezecard.length; i++){
        array = [];

        array.push(breezecard[i].breezecardNum);
        array.push('$' + breezecard[i].value);
        array.push('Remove');
        $datatable.row.add(array);
    }
    $datatable.draw();
};

var tableAddNewCard = function(breezecardNum, value) {
    var $datatable = $('#breezecards').DataTable();
    var array = [];
    array.push(breezecardNum);
    array.push('$' + value);
    array.push('Remove');
    $datatable.row.add(array);

    $datatable.draw();

};

var updateBreezecardInView = function(breezecardNum, value) {
    breezecard.push({
        'breezecardNum': breezecardNum,
        'value': value
    });
    tableAddNewCard(breezecardNum, value);
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
        if(breezecardNum == breezecard[i].breezecardNum) {
            alert('The card number is already belongs to this account!');
            $('#new-card-num').val('');
            $('#new-card-num').focus();
            return false;
        }
    }
    return true;

};