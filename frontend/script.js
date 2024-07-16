$(function(){
    document.getElementById('cocktail').innerHTML = "Loading...";
    $.ajax({
        url: 'http://127.0.0.1:7999/',
        type: 'get',
    }).done(function (response) {
        console.log("Api call worked", response);
        console.log(response["drinks"].length);
        cocktails = "";
        beer = "";
        shots = "";
        softdrinks = "";
        for (var i = 0; i < response["drinks"].length; i++) {
            if (response["drinks"][i]["type"] == "cocktail"){
                cocktails += "<li>" + response["drinks"][i]["name"] + " - " + response["drinks"][i]["price"] + "€" + "</li>";
            }
            else if (response["drinks"][i]["type"] == "beer"){
                beer += "<li>" + response["drinks"][i]["name"] + " - " + response["drinks"][i]["price"] + "€" + "</li>";
            }
            else if (response["drinks"][i]["type"] == "shots"){
                shots += "<li>" + response["drinks"][i]["name"] + " - " + response["drinks"][i]["price"] + "€" + "</li>";
            }
            else if (response["drinks"][i]["type"] == "softdrinks"){
                softdrinks += "<li>" + response["drinks"][i]["name"] + " - " + response["drinks"][i]["price"] + "€" + "</li>";
            }
        }
        document.getElementById("cocktail").innerHTML = cocktails;
        document.getElementById("beer").innerHTML = beer;
        document.getElementById("shots").innerHTML = shots;
        document.getElementById("nonAlcoholic").innerHTML = softdrinks;
    }).fail(function (error) {
        console.log(error);
    });
});