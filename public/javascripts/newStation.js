$(document).ready(function() {

    $('#check').attr('checked', true);

    $('#home').click(function() {
        window.location.href = '/stationsList.html';
    });

    $('#train').change(function() {
        $('#intersection').prop('disabled', true);
    });

    $('#bus').change(function() {
        $('#intersection').prop('disabled', false);
        $('#intersection').focus();
    });

    $('#create').click((e) => {
        $('#errormessage').text('');
        e.preventDefault();

        console.log('clicked');
        var name = $('#name').val();
        var stopID = $('#stopid').val();
        var fare = $('#fare').val();
        var intersection = $('#intersection').val();

        var isTrain = 1;

        if($('#bus').is(':checked')) {
            isTrain = 0;
        }

        var closeStatus = 0;

        if(!$('#check').is(':checked')) {
            closeStatus = 1;
        }

        if(parseFloat(fare) < 0 || parseFloat(fare) > 50) {
            $('#errormessage').text('fare must be between 0.00 to 50.00');
            return;
        }

        if(name.trim() == '' || stopID.trim() == '') {
            $('#errormessage').text('name or stop field cannot be the white space');
            return;
        }

        var data = {
            'name': name,
            'stopID': stopID,
            'fare': fare,
            'isTrain': isTrain,
            'closeStatus':closeStatus,
            'intersection': intersection
        };
        createStation(data);
    });

});

var createStation = function(data) {
    var url = 'http://localhost:8080/createStation';

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(result) {
            console.log(result);
            if(result != 'success') {
                $('#errormessage').text(result);
            }else{
                alert('created success!');

            }
        }

    });

};