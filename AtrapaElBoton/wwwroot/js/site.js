let cont = 0;
let intervalo = null;
let puntos = 0;

const Model = {
    iniciarJuego: function () {
        if (intervalo !== null) return;

        $("#bandera").removeAttr("disabled"); // Habilita el botón de la bandera
        intervalo = setInterval(() => {
            cont++;
            View.actualizarTiempo(cont);

            // Detiene el juego a los 10 segundos
            if (cont == 10) {
                Controller.terminarJuego();
            } else {
                Controller.moverBandera(); // Mueve la bandera cada segundo
            }
        }, 1000);
    },
    sumarPuntos: function () {
        puntos++;
        View.actualizarPuntos(puntos); // Muestra puntos ganados
    },
    reset: function () {
        // Reinicia el juego y no deja tocar la bandera
        clearInterval(intervalo);
        cont = 0;
        puntos = 0;
        intervalo = null;
        $("#bandera").attr("disabled", "disabled");
    }
};

const View = {
    actualizarTiempo: function (valor) {
        $("#time").text("Tiempo: " + valor);
    },
    actualizarPuntos: function (valor) {
        $("#puntos").text("Puntos: " + valor);
    },
    posicionarBandera: function (x, y) {
        //Ya acá cada tick del intervalo se posiciona diferente
        $("#bandera").css({ left: x + "px", top: y + "px" });
    }
};

const Controller = {
    iniciarEventos: function () {
        // Eventos de interacción con mouse
        $("#inicio").on("click", Model.iniciarJuego);
        $("#bandera").on("click", Model.sumarPuntos);

        // Eventos de teclado para accesibilidad
        $(document).on("keydown", function (e) {
            if (e.key === "Enter") {
                $("#inicio").trigger("click"); // Enter inicia juego
            }
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault(); // evitar scroll por espacio
                $("#bandera").trigger("click"); // Space simula click en bandera
            }
        });

        $("#bandera").on("focus", function () {
            $(this).css("outline", "2px solid blue");
        });
        $("#bandera").on("blur", function () {
            $(this).css("outline", "none");
        });
    },
    moverBandera: function () {

        //Esta es la parte para que el boton aparezca aleatoreo en el container 
        let container = $(".container");
        let contWidth = container.width();
        let contHeight = container.height();
        let botonWidth = $("#bandera").outerWidth();
        let botonHeight = $("#bandera").outerHeight();

        // Posiciones aleatorias en X y Y
        let randomX = Math.random() * (contWidth - botonWidth); //Esto es para saber en que posición de x puede aparecer el boton sin salirse del container
        let randomY = Math.random() * (contHeight - botonHeight); //Y esto es parecido solo que en y

        View.posicionarBandera(randomX, randomY);
    },
    terminarJuego: function () {
        // Reiniciar modelo y actualizar vista
        Model.reset();
        View.actualizarTiempo(0);
        View.actualizarPuntos(0);
    }
};

// Inicializar eventos al cargar el documento
$(document).ready(function () {
    Controller.iniciarEventos();
});