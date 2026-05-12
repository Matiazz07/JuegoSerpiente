
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CANVAS = 600;
const TAMANIO_CELDA = 25;
const SERPIENTE = [
  { x: 10, y: 9, },
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 11, y: 11 }
]

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
  dibujarSerpiente();
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
}

function moverSerpienteDerecha() {
  let posicionAnterior = { x: 0, y: 0 };
  if ((SERPIENTE[0].x + 2) * TAMANIO_CELDA > canvas.width) {
    return;
  }
  for (let i = 0; i < SERPIENTE.length; i++) {
    let posicionX = SERPIENTE[i].x;
    let posicionY = SERPIENTE[i].y;
    if (i == 0) {
      SERPIENTE[i].x = SERPIENTE[i].x + 1;
    } else {
      SERPIENTE[i].x = posicionAnterior.x;
      SERPIENTE[i].y = posicionAnterior.y;
    }
    posicionAnterior.x = posicionX;
    posicionAnterior.y = posicionY;
  }
}

function moverSerpienteAbajo() {
  let posicionAnterior = { x: 0, y: 0 };
  if ((SERPIENTE[0].y + 2) * TAMANIO_CELDA > canvas.height) {
    return;
  }
  for (let i = 0; i < SERPIENTE.length; i++) {
    let posicionX = SERPIENTE[i].x;
    let posicionY = SERPIENTE[i].y;
    if (i == 0) {
      SERPIENTE[i].y = SERPIENTE[i].y + 1;
    } else {
      SERPIENTE[i].x = posicionAnterior.x;
      SERPIENTE[i].y = posicionAnterior.y;
    }
    posicionAnterior.x = posicionX;
    posicionAnterior.y = posicionY;
  }
}

function moverSerpienteIzquierda() {
  let posicionAnterior = { x: 0, y: 0 };
  if ((SERPIENTE[0].x - 1) * TAMANIO_CELDA < 0) {
    return;
  }
  for (let i = 0; i < SERPIENTE.length; i++) {
    let posicionX = SERPIENTE[i].x;
    let posicionY = SERPIENTE[i].y;
    if (i == 0) {
      SERPIENTE[i].x = SERPIENTE[i].x - 1;
    } else {
      SERPIENTE[i].x = posicionAnterior.x;
      SERPIENTE[i].y = posicionAnterior.y;
    }
    posicionAnterior.x = posicionX;
    posicionAnterior.y = posicionY;
  }
}

function moverSerpienteArriba() {
  let posicionAnterior = { x: 0, y: 0 };
  if ((SERPIENTE[0].y - 1) * TAMANIO_CELDA < 0) {
    return;
  }
  for (let i = 0; i < SERPIENTE.length; i++) {
    let posicionX = SERPIENTE[i].x;
    let posicionY = SERPIENTE[i].y;
    if (i == 0) {
      SERPIENTE[i].y = SERPIENTE[i].y - 1;
    } else {
      SERPIENTE[i].x = posicionAnterior.x;
      SERPIENTE[i].y = posicionAnterior.y;
    }
    posicionAnterior.x = posicionX;
    posicionAnterior.y = posicionY;
  }
}


function cambiarDireccion(direccion) {
  switch (direccion) {
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
  dibujarTodo();
}