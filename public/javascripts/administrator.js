$(document).ready(function() {


    $('#logout').click(function(){
        window.location.href = '/index.html';
    });

    $('#SC').click(function() {
        window.location.href = '/suspendedCards.html';
    });

    $('#SM').click(function() {
        window.location.href = '/stationsList.html';
    });

    $('#BCM').click(function() {
        window.location.href = '/breezecard.html';
    });

    $('#PFR').click(function() {
        window.location.href = '/flowReport.html';
    });

});