let cont = 0;
let intervalo = null;
let puntos = 0;

$("#inicio").on("click", function () {

    if (intervalo !== null) return;
    $("#bandera").removeAttr("disabled");
    intervalo= setInterval(function () {
        cont++;
        $("#time").text("Tiempo: " + cont);
        if (cont == 10) {
            clearInterval(intervalo);
            cont = 0;
            intervalo = null;
            $("#bandera").attr("disabled", "disabled");
            puntos = 0;
        }
        //Esta es la parte para que el boton aparezca aleatoreo en el container 
        let container = $(".container");
        let contWidth = container.width();
        let contHeight = container.height();
        let botonWidth = $("#bandera").outerWidth();
        let botonHeight = $("#bandera").outerHeight();
        let randomX = Math.random() * (contWidth - botonWidth); //Esto es para saber en que posición de x puede aparecer el boton sin salirse del container
        let randomY = Math.random() * (contHeight - botonHeight); //Y esto es parecido solo que en y

        $("#bandera").css({ //Ya acá cada tick del intervalo se posiciona diferente
            left: randomX + "px",
            top: randomY + "px"
        });

    }, 1000);

});

$("#bandera").on("click", function () {
    puntos++;
    $("#puntos").text("Puntos: " + puntos);
});


