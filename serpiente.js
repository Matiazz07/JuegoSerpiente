const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CANVAS = 600;
const TAMANIO_CELDA = 25;
let SERPIENTE = [
  { x: 10, y: 9, },
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 11, y: 11 }
]
let direccionActual = "arriba";
let posicionComida = { x: 5, y: 5 };
let juegoterminado = false;
let puntaje = 0;
let velocidadSerpiente = 300;
let intervaloJuego;

function dibujarTablero() {
  ctx.strokeStyle = "#ff0000ff";
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
  ctx.lineWidth = 2;
}

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  dibujarSerpiente();
  crearComida();
}

function dibujarNumeros() {
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  let contador = 0;
  for (let i = 0; i <= canvas.width; i += TAMANIO_CELDA) {
    ctx.fillText(contador, 5, i + 12);
    contador++;
  }
  contador = 0;
  for (let i = 0; i <= canvas.height; i += TAMANIO_CELDA) {
    ctx.fillText(contador, i + 10, 15);
    contador++;
  }
}

function pintarCoordenada(x, y, color) {
  if (x < canvas.width && y < canvas.height) {
    ctx.fillStyle = color;
    ctx.fillRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.lineWidth = 2;
  }
}

function dibujarSerpiente() {
  let colorCabeza = "yellow";
  let colorCuerpo = "white";
  for (let i = 0; i < SERPIENTE.length; i++) {
    let serpiente = SERPIENTE[i];
    if (i == 0) {
      pintarCoordenada(serpiente.x, serpiente.y, colorCabeza);
    } else {
      pintarCoordenada(serpiente.x, serpiente.y, colorCuerpo);
    }
  }
  dibujarTablero();
}

function moverSerpienteDerecha() {
  let nuevoElemento = { x: 0, y: 0 }
  if ((SERPIENTE[0].x + 2) * TAMANIO_CELDA > canvas.width) {
    gameOver();
    return;
  }
  nuevoElemento.x = SERPIENTE[0].x + 1
  nuevoElemento.y = SERPIENTE[0].y
  SERPIENTE.unshift(nuevoElemento)
  SERPIENTE.pop()
}

function moverSerpienteAbajo() {
  let nuevoElemento = { x: 0, y: 0 }
  if ((SERPIENTE[0].y + 2) * TAMANIO_CELDA > canvas.height) {
    gameOver();
    return;
  }
  nuevoElemento.x = SERPIENTE[0].x
  nuevoElemento.y = SERPIENTE[0].y + 1
  SERPIENTE.unshift(nuevoElemento)
  SERPIENTE.pop()
}

function moverSerpienteIzquierda() {
  let nuevoElemento = { x: 0, y: 0 }
  if ((SERPIENTE[0].x - 1) * TAMANIO_CELDA < 0) {
    gameOver();
    return;
  }
  nuevoElemento.x = SERPIENTE[0].x - 1
  nuevoElemento.y = SERPIENTE[0].y
  SERPIENTE.unshift(nuevoElemento)
  SERPIENTE.pop()
}

function moverSerpienteArriba() {
  let nuevoElemento = { x: 0, y: 0 }
  if ((SERPIENTE[0].y - 1) * TAMANIO_CELDA < 0) {
    gameOver();
    return;
  }
  nuevoElemento.x = SERPIENTE[0].x
  nuevoElemento.y = SERPIENTE[0].y - 1
  SERPIENTE.unshift(nuevoElemento)
  SERPIENTE.pop()
}

function cambiarDireccion(direccion) {
  direccionActual = direccion;
}

function iniciarJuego() {
  intervaloJuego = setInterval(moverSerpiente, 1000 - velocidadSerpiente);
  cambiarEstado("Cazando!");
}

function pausarJuego() {
  clearInterval(intervaloJuego);
  cambiarEstado("Descanzando...");
}

function moverSerpiente() {
  let atrapada = verificarColision();
  if (juegoterminado) {
    return;
  }
  switch (direccionActual) {
    case "arriba":
      moverSerpienteArriba();
      break;
    case "abajo":
      moverSerpienteAbajo();
      break;
    case "izquierda":
      moverSerpienteIzquierda();
      break;
    case "derecha":
      moverSerpienteDerecha();
      break;
  }
  if (atrapada) {
    SERPIENTE.push(posicionComida);
    aumentarPuntaje();
    pintarComidaRandom();
  }
  dibujarTodo();
}

function crearComida() {
  pintarCoordenada(posicionComida.x, posicionComida.y, "green");
}

function pintarComidaRandom() {
  posicionComida.x = Math.floor(Math.random() * canvas.width / TAMANIO_CELDA);
  posicionComida.y = Math.floor(Math.random() * canvas.height / TAMANIO_CELDA);
  pintarCoordenada(posicionComida.x, posicionComida.y, "green");
}

function verificarColision() {
  if (posicionComida.x == SERPIENTE[0].x && posicionComida.y == SERPIENTE[0].y) {
    return true;
  }
  return false;
}

function aumentarPuntaje() {
  puntaje++;
  if (puntaje % 2 == 0 && velocidadSerpiente <= 800) {
    velocidadSerpiente += 50;
    intervaloJuego = setInterval(moverSerpiente, 1000 - velocidadSerpiente);
  }
  document.getElementById("puntaje").innerHTML = puntaje;
}

function cambiarEstado(estado) {
  document.getElementById("estado").innerHTML = estado;
}

function gameOver() {
  juegoterminado = true;
  clearInterval(intervaloJuego);
  cambiarEstado("Game Over");
}

function reiniciarJuego() {
  limpiarCanvas();
  dibujarTablero();
  SERPIENTE = [
    { x: 10, y: 9, },
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 11, y: 11 }
  ]
  puntaje = 0;
  direccionActual = "arriba";
  cambiarEstado("Listo");
  juegoterminado = false;
  pintarComidaRandom();
  dibujarSerpiente();
  clearInterval(intervaloJuego);
}