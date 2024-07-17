$(setInterval(function(){
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
            var up = "up";
            if (response["drinks"][i]["change"] == "down") {
                up = "down";
            }
            if (response["drinks"][i]["type"] == "cocktail"){
                cocktails += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + response["drinks"][i]["name"] + "  " + response["drinks"][i]["price"].toFixed(2) + "€" + "</div></li>";
            }
            else if (response["drinks"][i]["type"] == "beer"){
                beer += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + response["drinks"][i]["name"] + "  " + response["drinks"][i]["price"].toFixed(2) + "€" + "</div></li>";
            }
            else if (response["drinks"][i]["type"] == "shots"){
                shots += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + response["drinks"][i]["name"] + "  " + response["drinks"][i]["price"].toFixed(2) + "€" + "</div></li>";
            }
            else if (response["drinks"][i]["type"] == "softdrinks"){
                softdrinks += "<li onClick=\"showPopup(\'" + response["drinks"][i]["name"] + "\'," + response["drinks"][i]["price"].toFixed(2) + ")\"><div data-browser=\"" + up + "\" >" + response["drinks"][i]["name"] + "  " + response["drinks"][i]["price"].toFixed(2) + "€" + "</div></li>";
            }
        }
        document.getElementById("cocktail").innerHTML = cocktails;
        document.getElementById("beer").innerHTML = beer;
        document.getElementById("shots").innerHTML = shots;
        document.getElementById("nonAlcoholic").innerHTML = softdrinks;
    }).fail(function (error) {
        console.log(error);
    });
}, 1000));

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
    Swal.fire({
        title: value1 + " - " + value2.toFixed(2) + "€",
        text: "How many do you want to Order?",
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
                    "amount": Number(amount)
                }),
            }).done(function (response) {
                console.log("Api call worked", response);
            }).fail(function (error) {
                console.log(error);
            })
        }
    });

}