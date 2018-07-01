$(document).ready(function() {

    getSuspendedCards();

    var breezecardNum;
    var new_owner;
    var old_owner;

    $('#cards').on('click', 'tr', function() {
        var $datatable = $('#cards').DataTable();

        breezecardNum = $datatable.row(this).data()[0];
        new_owner = $datatable.row(this).data()[1];
        old_owner = $datatable.row(this).data()[3];

        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#to-new-btn').prop('disabled', true);
            $('#to-old-btn').prop('disabled', true);
        } else{
            $datatable.$('tr.selected').removeClass('selected');

            $(this).addClass('selected');
            $('#to-new-btn').prop('disabled', false);
            $('#to-old-btn').prop('disabled', false);
        }
    });

    $('#to-new-btn').click(function() {
        assignCardToNewOwner(breezecardNum, new_owner, old_owner);
    });

    $('#to-old-btn').click(function() {
        assignCardToOldOwner(breezecardNum, new_owner, old_owner);
    });

    $('#home').click(function() {
        window.location.href = '/administrator.html';
    });


});

var assignCardToNewOwner = function(breezecardNum, new_owner, old_owner) {

    var url = 'http://localhost:8080/assignToNewOwner';

    var data = {
        'breezecardNum': breezecardNum,
        'newOwner': new_owner,
        'oldOwner': old_owner
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(result) {
            console.log(result);
            if(result == 'update success') {
                getSuspendedCards();
            }
        }
    });
};

var assignCardToOldOwner = function(breezecardNum, new_owner, old_owner) {
    
    var url = 'http://localhost:8080/assignToOldOwner';

    var data = {
        'breezecardNum': breezecardNum,
        'newOwner': new_owner,
        'oldOwner': old_owner
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(result) {
            console.log(result);
            
            if(result == 'update success') {
                getSuspendedCards();
            }
        }
    });
};

var getSuspendedCards = function() {

    var url = 'http://localhost:8080/getSuspendedCards';

    $.ajax({
        type: 'GET',
        url: url,
        success: function(result) {
            drawTable(result);
        }
    });

};

var drawTable = function(data) {

    var $dataTable = $('#cards').DataTable();

    $dataTable.clear();

    var parsedData = JSON.parse(data);

    var array;

    for(var i = 0; i < parsedData.length; i++){
        array = [];

        array.push(parsedData[i].BreezecardNum);
        array.push(parsedData[i].Username);
        array.push(parsedData[i].DateTime);
        array.push(parsedData[i].BelongsTo);

        $dataTable.row.add(array);

    }

    $dataTable.draw();




};