
$(document).ready(function() {

    $('#signin-error-div').hide();
    $('#passenger-div').hide();

    $('#sign-in-form').find('#username').on('click keyup', function() {
        $('sigin-error-div').hide();
    });

    $('#sign-in-form').find('#password').on('click keyup', function() {
        $('sigin-error-div').hide();
    });

    $('#sign-in-form').submit(function(e) {
        e.preventDefault();

        var d = $(this).serialize();

        $.ajax({
            url: 'http://localhost:8080/login',
            type: 'POST',
            data: d,
            success: function (result) {
                verifySignIn(result);
            }
        });
    });

});

var verifySignIn = function(result) {
    switch (result.statusCode) {
    case 'OK':
        $('#login').hide();
        if (result.isAdmin == 'TRUE') {
            window.location.href = '/administration.html';
        } else {
            var username = $('#username1').val();
            window.location.href = `/passengerBreezecards.html?username=${username}`;
        }
        break;
    
    case 'WRONG_PASSWORD':
        showSignInError('Invalid username or password');
        console.log(result);
        $('#username').text('');
        $('#password').text('');
        break;

    case 'NO_USER':
        showSignInError('User does not exist');
        console.log(result);
        $('#username').text('');
        $('#password').text('');
        break;
    }
};

var showSignInError = function(msg) {
    $('#signin-error-div').find('#error-msg').text(msg);

    $('#signin-error-div').show();
};