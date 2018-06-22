$(document).ready(function () {

    // make signin-error-div invisible
    $('#register-error-div').hide();
    $('#password-err').hide();
    $('#card-err').hide();
    $('#breezecard_numb_div').hide();
    $('#breeze_card_switch').focus();

    $('#breeze_card_switch').change(function() {
        if (this.checked) {
            $('#breezecard_numb_div').show();
        }else{
            $('#breezecard_num').val('');
            $('#breezecard_numb_div').hide();
        }
    });


    $('#register-form').submit(function (e) {
        e.preventDefault();
        var password = $('#password').val();
        var password_confirm = $('#password_confirm').val();
        
        if(password !== password_confirm) {
            showRegisterError('Password does not match');
            return;
        }

        if($('#breeze_card_switch').is(':checked')) {
            var value = $('#breezecard_num').val();

            console.log(value);

            var pattern = new RegExp('^[0-9]{16}');

            var check = pattern.test(value);

            if(!check) {
                showRegisterError('Breeze card number should be 16 digits');
                return;
            }
        }

        var d = $(this).serialize();

        console.log(d);

        $.ajax({
            url: 'http://localhost:8080/register',
            type: 'POST',
            data: d,
            success: function (result) {


                //verifyRegister(result);
            }
        });
    });

    //////////////// Function Definition ///////////////////////////
    var verifyRegister = function (result) {
        switch (result.statusCode) {
        case 'OK':
            var username = result.username;
            console.log(result.username);
            window.location.href = `/passengerBreezecards.html?username=${username}`;
            break;

        case 'USER_NAME_OR_EMAIL_NOT_UNIQUE':
            console.log(result);
            showRegisterError(result.message); // show error messag
            break;

        case 'CONFLICT':
            alert(result.message);
            username = result.username;
            console.log(result.username);
            window.location.href = `/passengerBreezecards.html?username=${username}`;
            break;

        case 'CONFLICT_AGAIN':
            console.log(result);
            alert(result.message);
            break;
        }
    };


    var showRegisterError = function (msg) {
        $('#register-error-div').find('#error-msg').text(msg);
        $('#register-error-div').show();
    };
});