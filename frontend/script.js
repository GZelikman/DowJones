$(function(){
    document.getElementById('drinks').innerHTML = "Loading...";
    $.ajax({
        url: 'http://127.0.0.1:7999/',
        type: 'get',
    }).done(function (response) {
        console.log("Api call worked", response);
        console.log(response["drinks"].length);
        for (var i = 0; i < response["drinks"].length; i++) {
            document.getElementById("drinks").innerHTML = response["drinks"][i]["name"] + " - " + response["drinks"][i]["price"];
        }
    }).fail(function (error) {
        console.log(error);
    });
});