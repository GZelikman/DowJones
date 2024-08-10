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
                aktuelleTische += "<img id=\"tischpic\" src=\"images/icons8-table-96.png\" width=\"50\" height=\"50\"><div id=\"tisch\" onclick=\"showPopup(" + i + "," + number + ")\">" + number + " has " + response["Tische"][i][number].length + " Orders</div><br>";
            }
            else{
                aktuelleTische += "<div id=\"tisch\" onclick=\"showPopup(" + i + "," + number + ")\"> Tisch Nr. " + number + " has 1 Order</div><br>";
            }
        }
        document.getElementById("Tische").innerHTML = aktuelleTische;
    }).fail(function (error) {
        console.log(error);
    });
}, 2000));

function showPopup(value1,value2) {
    console.log(value1, value2);
}