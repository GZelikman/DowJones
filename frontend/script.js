function redirect(){
    var number = document.getElementById("number").value;
    window.location.href = "./index.html?tisch=" + number;
}

function goebrr(value){
    let number = document.getElementById("number").value;
    if (number == 0){
        console.log(number)
        document.getElementById("number").value = value;
    }
    else{
        document.getElementById("number").value = number + value;
    }
}

function deleteInput(){
    document.getElementById("number").value = 0
}

$(setInterval(function(){
    $.ajax({
        url: 'http://127.0.0.1:7999/',
        type: 'get',
    }).done(function (response) {
        console.log("Api get worked");
        cocktails = "";
        beer = "";
        shots = "";
        softdrinks = "";
        for (var i = 0; i < response["drinks"].length; i++) {
            var up = "up";
            var color = "green";
            if (response["drinks"][i]["change"] == "down") {
                up = "down";
                color = "red";
            }
            var backspace = "";
            for (var j = 0; j < (20 -response["drinks"][i]["name"].length); j++) {
                backspace += "&nbsp;";
            }
            drink = response["drinks"][i]["name"] + backspace;
            if (response["drinks"][i]["type"] == "cocktail"){
                cocktails += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + drink + "  <span class=\"" + color + "\">" + response["drinks"][i]["price"].toFixed(2) + "€</span></div></li>";
            }
            else if (response["drinks"][i]["type"] == "beer"){
                beer += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + drink + "  <span class=\"" + color + "\">" + response["drinks"][i]["price"].toFixed(2) + "€</span></div></li>";
            }
            else if (response["drinks"][i]["type"] == "shots"){
                shots += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + drink + "  <span class=\"" + color + "\">" + response["drinks"][i]["price"].toFixed(2) + "€</span></div></li>";
            }
            else if (response["drinks"][i]["type"] == "softdrinks"){
                softdrinks += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + drink + "  <span class=\"" + color + "\">" + response["drinks"][i]["price"].toFixed(2) + "€</span></div></li>";
            }
        }
        var zaehler = 0
        for (var i = 0; i < response["drinks"].length; i++) {
            if (response["drinks"][i]["min"] != response["drinks"][i]["price"]){
                zaehler += 1
                document.getElementById("information").innerHTML = "";
            }
        }
        if (zaehler == 0){
            document.getElementById("information").innerHTML = "Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash! Market Crash!";
        }
        document.getElementById("cocktail").innerHTML = cocktails;
        document.getElementById("beer").innerHTML = beer;
        document.getElementById("shots").innerHTML = shots;
        document.getElementById("nonAlcoholic").innerHTML = softdrinks;
    }).fail(function (error) {
        console.log(error);
    });
}, 2000));

var buyDrinks = function(value1,value2) {
    console.log(value1, value2.toFixed(2));

    $.ajax({
        url: 'http://localhost:7999/buyDrinks',
        type: 'post',
        data: {
            drink: value1,
            price: value2.toFixed(2)
        },
        contentType: 'application/json; charset=utf-8',
        processData: false,
        contentType: false,
    }).done(function (response) {
        console.log("Api call worked", response);
    }).fail(function (error) {
        console.log(error);
    })
};

const inputValue = 1

function showPopup(value1,value2) {
    var tisch = document.URL.split('?')[1].split("=")[1]
    $.ajax({
        url: 'http://localhost:7999/getPricesOfName',
        type: 'post',
        data: JSON.stringify({
            "drink": String(value1),
        }),
    }).done(function (response) {
        console.log("Got prices from Server");
        var insert = '<img id="graph" src="data:image/png;base64,' + response + '" /><br>How many do you want to buy?';
        Swal.fire({
            title: value1 + " - " + value2.toFixed(2) + "€",
            html: insert,
            input: 'range',
            inputValue,
            inputAttributes: {
                min: '1',
                max: '10',
            },
            showCancelButton: true,
            confirmButtonText: "Order",
            showCloseButton: true,
            preConfirm: async (amount) => {
                console.log(value1, value2.toFixed(2), amount);
                
                $.ajax({
                    url: 'http://localhost:7999/buyDrinks',
                    type: 'post',
                    data: JSON.stringify({
                        "drink": String(value1),
                        "price": value2.toFixed(2),
                        "amount": Number(amount),
                        "tisch" : tisch
                    }),
                }).done(function (response) {
                    console.log("Api call worked", response);
                }).fail(function (error) {
                    console.log(error);
                })
            }
        });
    }).fail(function (error) {
        console.log(error);
    })
}