$(setInterval(function(){
    $.ajax({
        url: 'http://localhost:7999/getPricesOfName',
        type: 'post',
        data: JSON.stringify({
            "drink": "Long Dong",
        }),
    }).done(function (response) {
        console.log("Got prices from Server");
        var insert = '<div><img src="data:image/png;base64,' + response + '" /></div>';
        document.getElementById("image_div").innerHTML = insert;
        
    }).fail(function (error) {
        console.log(error);
    })
}, 2000));