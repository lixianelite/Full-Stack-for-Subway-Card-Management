var username = String(window.location.search.split('?')[1].split('=')[1]);

$(document).ready(function() {
    initTripHistory();

    $('#starttime').on('change', function () {
        getTripHistory(getTripHistoryOption());
    });

    $('#endtime').on('change', function () {
        getTripHistory(getTripHistoryOption());
    });

    $('#reset').click(function() {
        var $datatable = $('#trips').DataTable();
        $datatable.clear();
        $('#starttime').val('');
        $('#endtime').val('');
        getTripHistory(getTripHistoryOption());
    });

    $('#back').click(function() {
        window.location.href = `/passengerBreezecards.html?username=${username}`;

    });



});

var initTripHistory = function() {
   
    getTripHistory(getTripHistoryOption());

};

var getTripHistoryOption = function() {
    var opt = {
        'username': username,
        'starttime': $('#starttime').val(),
        'endtime': $('#endtime').val()
    };
    return opt;
};

var getTripHistory = function(opt) {
    var url = 'http://localhost:8080/tripHistory';
    
    var $datatable = $('#trips').DataTable();

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url,
        data: opt,
        success: function(result) {

            $datatable.clear();

            var jsonObject = JSON.parse(result);
            var array;
            for(var i = 0; i < jsonObject.length; i++) {
                array = [];
                array.push(formatDate(jsonObject[i].StartTime));
                array.push(jsonObject[i].Source);
                array.push(jsonObject[i].Destination);
                array.push(jsonObject[i].Tripfare);
                array.push(jsonObject[i].BreezecardNum);
                $datatable.row.add(array);
            }
            $datatable.draw();
        }
    });
};

var formatDate = function(origin) {
    var dateTime = new Date(origin);
    var date = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate();
    var time = dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds();
    dateTime = date + ' ' + time;
    return dateTime;
};


