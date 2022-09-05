const $cartas = document.querySelectorAll(".carta");
const $contenedorCartas = document.querySelector("main");

let $primeraCartaSeleccionada = null;

document.querySelector("#jugar").onclick = setearJuego;

$cartas.forEach(function ($carta) {
  $carta.onclick = function () {
    const color = $carta.id;
    agregarColor($carta, color);
    if ($primeraCartaSeleccionada === null) {
      $primeraCartaSeleccionada = $carta;
    } else {
      if ($primeraCartaSeleccionada === $carta) {
        return;
      }
      if ($primeraCartaSeleccionada.id === $carta.id) {
        bloquearClicksUsuario();
        setTimeout(() => {
          eliminarCarta($primeraCartaSeleccionada);
          eliminarCarta($carta);
          desbloquearClicksUsuario();
          verSiGano();
        }, 600);
      } else {
        bloquearClicksUsuario();
        setTimeout(() => {
          eliminarColor($carta, color);
          eliminarColor(
            $primeraCartaSeleccionada,
            $primeraCartaSeleccionada.id
          );
          desbloquearClicksUsuario();
        }, 600);
      }
      setTimeout(() => {
        $primeraCartaSeleccionada = null;
      }, 600);
    }
  };
});

function bloquearClicksUsuario() {
  $contenedorCartas.classList.add("bloquear");
}
function desbloquearClicksUsuario() {
  $contenedorCartas.classList.remove("bloquear");
}
function eliminarCarta($carta) {
  $carta.remove();
}
function agregarColor($carta, color) {
  $carta.classList.add(color);
}
function eliminarColor($carta, color) {
  $carta.classList.remove(color);
}

function setearJuego() {
  desbloquearClicksUsuario();
  const COLORES = ["rojo", "azul", "verde", "amarillo"];
  const coloresRepetidos = COLORES.concat(COLORES);
  mezclarColores(coloresRepetidos);
  configurarCartas(coloresRepetidos);
}
function configurarCartas(colores) {
  colores.forEach(function (color, i) {
    $cartas[i].id = color;
  });
}
function mezclarColores(colores) {
  colores.sort((a, b) => 0.5 - Math.random());
}

function verSiGano() {
  if (document.querySelectorAll(".carta").length === 0) {
    bloquearClicksUsuario();
    alert("Ganaste! para volver a jugar seleccione jugar nuevamente");
  }
}
