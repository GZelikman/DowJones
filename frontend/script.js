$(function(){
    document.getElementById('content').innerHTML = "Loading...";
    $.ajax({
        url: 'http://127.0.0.1:7999/',
        type: 'get',
    }).done(function (response) {
        console.log("Api call worked", response);
        document.getElementById('content').innerHTML = response;
    }).fail(function (error) {
        console.log(error);
    });
});