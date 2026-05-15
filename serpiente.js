const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CANVAS = 600;
const TAMANIO_CELDA = 25;
let SERPIENTE = [
  { x: 10, y: 9 },
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 11, y: 11 }
];
let OBSTACULOS = [];
let direccionActual = "arriba";
let posicionComida = { x: 5, y: 5 };
let juegoterminado = false;
let puntaje = 0;
let velocidadSerpiente = 300;
let intervaloJuego = null;

function cerrarModal(id) {
  document.getElementById(id).classList.remove("activo");
}

function mostrarModal(id) {
  document.getElementById(id).classList.add("activo");
}

function dibujarTablero() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i += TAMANIO_CELDA) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i <= canvas.height; i += TAMANIO_CELDA) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  dibujarObstaculos();
  crearComida();
  dibujarSerpiente();
}

function pintarCoordenada(x, y, color) {
  if (x < canvas.width && y < canvas.height) {
    ctx.fillStyle = color;
    ctx.fillRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.strokeRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.lineWidth = 2;
  }
}

function dibujarSerpiente() {
  let colorCabeza = "#facc15";
  let colorCuerpo = "#e2e8f0";
  for (let i = 0; i < SERPIENTE.length; i++) {
    let serpiente = SERPIENTE[i];
    if (i == 0) {
      pintarCoordenada(serpiente.x, serpiente.y, colorCabeza);
      ctx.fillStyle = "black";
      ctx.fillRect(serpiente.x * TAMANIO_CELDA + 6, serpiente.y * TAMANIO_CELDA + 6, 4, 4);
      ctx.fillRect(serpiente.x * TAMANIO_CELDA + 15, serpiente.y * TAMANIO_CELDA + 6, 4, 4);
    } else {
      pintarCoordenada(serpiente.x, serpiente.y, colorCuerpo);
    }
  }
}

function crearComida() {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let centroX = (posicionComida.x * TAMANIO_CELDA) + (TAMANIO_CELDA / 2);
  let centroY = (posicionComida.y * TAMANIO_CELDA) + (TAMANIO_CELDA / 2) + 2;
  ctx.fillText("🍎", centroX, centroY);
}

function dibujarObstaculos() {
  for (let obs of OBSTACULOS) {
    pintarCoordenada(obs.x, obs.y, "#64748b");
  }
}

function cambiarDireccion(direccion) {
  if (direccionActual === "arriba" && direccion === "abajo") return;
  if (direccionActual === "abajo" && direccion === "arriba") return;
  if (direccionActual === "izquierda" && direccion === "derecha") return;
  if (direccionActual === "derecha" && direccion === "izquierda") return;

  direccionActual = direccion;
}

function moverSerpiente() {
  if (juegoterminado) return;
  let nuevoElemento = { x: SERPIENTE[0].x, y: SERPIENTE[0].y };
  switch (direccionActual) {
    case "arriba": nuevoElemento.y -= 1; break;
    case "abajo": nuevoElemento.y += 1; break;
    case "izquierda": nuevoElemento.x -= 1; break;
    case "derecha": nuevoElemento.x += 1; break;
  }
  if (nuevoElemento.x < 0 || nuevoElemento.x >= canvas.width / TAMANIO_CELDA ||
    nuevoElemento.y < 0 || nuevoElemento.y >= canvas.height / TAMANIO_CELDA) {
    gameOver();
    return;
  }
  for (let parte of SERPIENTE) {
    if (nuevoElemento.x === parte.x && nuevoElemento.y === parte.y) {
      gameOver();
      return;
    }
  }
  for (let obs of OBSTACULOS) {
    if (nuevoElemento.x === obs.x && nuevoElemento.y === obs.y) {
      gameOver();
      return;
    }
  }
  SERPIENTE.unshift(nuevoElemento);
  if (nuevoElemento.x === posicionComida.x && nuevoElemento.y === posicionComida.y) {
    aumentarPuntaje();
    pintarComidaRandom();
  } else {
    SERPIENTE.pop();
  }
  dibujarTodo();
}

function iniciarJuego() {
  if (juegoterminado) return;
  clearInterval(intervaloJuego);
  intervaloJuego = setInterval(moverSerpiente, 1000 - velocidadSerpiente);
  cambiarEstado("Cazando! 🐍");
  dibujarTodo();
}

function pausarJuego() {
  if (juegoterminado) return;
  if (intervaloJuego) {
    clearInterval(intervaloJuego);
    intervaloJuego = null;
    cambiarEstado("Pausado ⏸️");
  } else {
    iniciarJuego();
  }
}

function pintarComidaRandom() {
  let posicionValida = false;
  let nuevaX = 0;
  let nuevaY = 0;
  while (!posicionValida) {
    nuevaX = Math.floor(Math.random() * (canvas.width / TAMANIO_CELDA));
    nuevaY = Math.floor(Math.random() * (canvas.height / TAMANIO_CELDA));
    posicionValida = true;
    for (let parte of SERPIENTE) {
      if (nuevaX === parte.x && nuevaY === parte.y) {
        posicionValida = false;
        break;
      }
    }
    if (posicionValida) {
      for (let obs of OBSTACULOS) {
        if (nuevaX === obs.x && nuevaY === obs.y) {
          posicionValida = false;
          break;
        }
      }
    }
  }
  posicionComida.x = nuevaX;
  posicionComida.y = nuevaY;
}

function generarObstaculo() {
  let nuevoObs = {
    x: Math.floor(Math.random() * (canvas.width / TAMANIO_CELDA)),
    y: Math.floor(Math.random() * (canvas.height / TAMANIO_CELDA))
  };
  OBSTACULOS.push(nuevoObs);
}

function aumentarPuntaje() {
  puntaje++;
  if (puntaje % 2 == 0 && velocidadSerpiente <= 850) {
    velocidadSerpiente += 50;
    clearInterval(intervaloJuego);
    intervaloJuego = setInterval(moverSerpiente, 1000 - velocidadSerpiente);
  }
  if (puntaje % 5 === 0) {
    generarObstaculo();
  }
  document.getElementById("puntaje").innerHTML = puntaje;
}

function cambiarEstado(estado) {
  document.getElementById("estado").innerHTML = estado;
}

function gameOver() {
  juegoterminado = true;
  clearInterval(intervaloJuego);
  intervaloJuego = null;
  cambiarEstado("Game Over ☠️");
  mostrarModal("modalGameOver");
}

function reiniciarJuego() {
  clearInterval(intervaloJuego);
  intervaloJuego = null;
  SERPIENTE = [
    { x: 10, y: 9 },
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 11, y: 11 }
  ];
  OBSTACULOS = [];
  puntaje = 0;
  velocidadSerpiente = 300;
  direccionActual = "arriba";
  juegoterminado = false;
  document.getElementById("puntaje").innerHTML = puntaje;
  cambiarEstado("Listo");
  pintarComidaRandom();
  dibujarTodo();
}

document.addEventListener("keydown", function (evento) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(evento.key) > -1) {
    evento.preventDefault();
  }
  switch (evento.key) {
    case "ArrowUp":
    case "w":
    case "W":
      cambiarDireccion("arriba");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      cambiarDireccion("abajo");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      cambiarDireccion("izquierda");
      break;
    case "ArrowRight":
    case "d":
    case "D":
      cambiarDireccion("derecha");
      break;
  }
});