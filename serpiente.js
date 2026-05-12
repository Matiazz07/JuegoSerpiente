
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CANVAS = 500;
const TAMANIO_CELDA = 25;

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
  dibujarNumeros();
  pintarCoordenada(23, 23);
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

function pintarCoordenada(x, y) {
  if (x < canvas.width && y < canvas.height) {
    ctx.fillStyle = "white";
    ctx.fillRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(x * TAMANIO_CELDA, y * TAMANIO_CELDA, TAMANIO_CELDA, TAMANIO_CELDA);
    ctx.lineWidth = 2;
  }
}
