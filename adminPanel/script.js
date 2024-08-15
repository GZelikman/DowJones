$(setInterval(function(){
    $.ajax({
        url: 'http://127.0.0.1:7999/getOrders',
        type: 'get',
    }).done(function (response) {
        aktuelleTische = "";
        for(var i = 0; i < response["Tische"].length; i++){
            var number = "";
            for (j in response["Tische"][i]){
                number = j;
            }
            if(response["Tische"][i][number].length > 0 ){
                aktuelleTische += "<div id=\"tisch\" onclick=\"showPopup(" + i + "," + number + ")\"><img id=\"tischpic\" src=\"images/table.png\" width=\"42\" height=\"30\"><div id=\"number\">" + number + "</div><div id =\"orders\">" + response["Tische"][i][number].length + " Orders</div></div><br>";
            }
            else{
                aktuelleTische += "<div id=\"tisch\" onclick=\"showPopup(" + i + "," + number + ")\"><img id=\"tischpic\" src=\"images/table.png\" width=\"42\" height=\"30\"><div id=\"number\">" + number + "</div><div id =\"orders\">1 Order</div></div><br>";
            }
        }
        document.getElementById("Tische").innerHTML = aktuelleTische;
    }).fail(function (error) {
        console.log(error);
    });
}, 2000));

function showPopup(value1,value2) {
    $.ajax({
        url: 'http://127.0.0.1:7999/getOrders',
        type: 'get',
    }).done(function (response) {
        if (response["Tische"][value1][value2].length > 0){
            return;
        }
        else{
            var amount = response["Tische"][value1][value2]["orders"][2];
            var price = response["Tische"][value1][value2]["orders"][1];
            var drink = response["Tische"][value1][value2]["orders"][0];
            var insert = "Getränk: " + drink + "<br>Preis: " + price + "€<br>Anzahl: " + amount;
        }
        Swal.fire({
            title: amount + " - " + drink,
            html: insert,
            showCancelButton: true,
            confirmButtonText: "Fertig",
            showCloseButton: true,
            preConfirm: async (amount) => {
            }
        });
    }).fail(function (error) {
        console.log(error);
    })
}