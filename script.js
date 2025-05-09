const board = document.getElementById('board');
const movesList = document.getElementById('moves-list');
const playPauseBtn = document.getElementById('playPauseBtn');
const icon = playPauseBtn.querySelector('i');

const iterations = document.querySelector('input[name="epochs"]').value;
const populationSize = document.querySelector('input[name="population"]').value;

let knightPosition = null;
let knightMoves = [0, 17, 2, 24]; // ou como quiser gerar
let animationInProgress = false;
let animationTimeouts = [];
let currentMoveIndex = 0;
let justChecking = false;

const lado = 8;

function createBoard() {
  for (let row = 0; row < lado; row++) {
    for (let col = 0; col < lado; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const isLight = (row + col) % 2 === 0;
      cell.classList.add(isLight ? 'light' : 'dark');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.innerHTML = row * lado + col;

      cell.addEventListener('click', () => {
        clearVisited();
        placeKnight(row, col);
      });

      board.appendChild(cell);
    }
  }
}

function placeKnight(row, col) {
  playPauseBtn.disabled = false;
  // Remove cavalo anterior
  if (knightPosition) {
    const oldIndex = knightPosition.row * lado + knightPosition.col;
    const oldCell = board.children[oldIndex];
    oldCell.classList.remove('knight');
  }

  // Adiciona classe à nova célula
  const index = row * lado + col;
  const cell = board.children[index];
  cell.classList.add('knight');

  knightPosition = { row, col };

  // Registra lance
  const moveNotation = 'N' + getChessNotation(row, col);
  addMove(moveNotation);
}


function getChessNotation(row, col) {
  const files = 'abcdefgh';
  return files[col] + (lado - row);
}

function getRowColumn(str) {
  let row = str.charCodeAt(0) - 'a'.charCodeAt(0);
  let col = parseInt(str[1]) - 1;
  return { row, col };
}

function getRowColumnFromIndex(index) {
  let row = parseInt(Math.floor(index / lado));
  let col = index % lado;
  return { row, col };
}

function getRowColumnIndex(str) {
  let row = str.charCodeAt(0) - 'a'.charCodeAt(0);
  let col = parseInt(str[1]) - 1;
  return row * lado + col;
}

function addMove(notation) {
  const li = document.createElement('li');
  li.textContent = notation;
  movesList.appendChild(li);
  movesList.scrollTop = movesList.scrollHeight;
}

function clearMovesList(notation) {
  movesList.innerHTML = '';
}

function badvisit(currentMoveIndex, moves) {
  if (currentMoveIndex == 0) {
    return false;
  }
  let { row: rowOld, col: colOld } = getRowColumnFromIndex(moves[currentMoveIndex - 1])
  let { row, col } = getRowColumnFromIndex(moves[currentMoveIndex])

  if (Math.abs(row - rowOld) == 1) {
    if (Math.abs(col - colOld) == 2) {
      return false;
    }
  } else if (Math.abs(row - rowOld) == 2) {
    if (Math.abs(col - colOld) == 1) {
      return false;
    }
  }
  return true;
}

function animateKnightMoves(moves) {
  console.log("Animando: ", JSON.stringify(knightMoves))
  if (animationInProgress) return; // Não iniciar se já estiver em andamento
  animationInProgress = true;
  currentMoveIndex = 0;

  function moveNext() {
    if (currentMoveIndex >= moves.length) {
      justChecking = false;
      stopAnimation();
      return;
    }

    let index = moves[currentMoveIndex];
    let { row, col } = getRowColumnFromIndex(index)
    placeKnight(row, col)

    const cell = board.children[index];

    if (badvisit(currentMoveIndex, moves)) {
      cell.classList.add('bad-visit');
      justChecking = true;
    } else if (justChecking) {
      cell.classList.add('just-checking');
    }
    else {
      // Marca a casa como visitada
      cell.classList.add('visited');
    }

    currentMoveIndex++;
    animationTimeouts.push(setTimeout(moveNext, 600)); // tempo entre os movimentos
  }

  moveNext();
}

function clearVisited() {
  // Remove o visited de todas as casas
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('visited');
    cell.classList.remove('bad-visit');
  });
}

async function runGeneticAndAnimateA() {
  animateKnightMoves(knightMoves);
}

async function runGeneticAndAnimate() {
  try {
    playPauseBtn.disabled = true;

    // Mostra estado de processamento
    icon.classList.replace('fa-play', 'fa-spinner');
    icon.classList.add('fa-spin');

    // Aguarda o algoritmo genético terminar
    // knightMoves = await geneticAlgorithm(iterations = iterations, populationSize = populationSize, pm = 0.8, pc = 0.8, tournamentSize = 3, pElitism = 5);
    knightMoves = await geneticAlgorithm();

    // Prepara para animação
    icon.classList.replace('fa-spinner', 'fa-pause');
    icon.classList.remove('fa-spin');
    playPauseBtn.disabled = false;
    clearMovesList();

    // Executa a animação
    animateKnightMoves(knightMoves);
  } catch (error) {
    console.error("Erro:", error);
  }
}

function stopAnimation() {
  animationInProgress = false;
  animationTimeouts.forEach(timeout => clearTimeout(timeout));
  document.getElementById('playPauseBtn').querySelector('i')
    .classList.replace('fa-pause', 'fa-play');
}

function toggleAnimation() {
  if (animationInProgress) {
    // Lógica para pausar
    stopAnimation();
  } else {
    runGeneticAndAnimate();
  }
}

function atualizarBarraProgresso(g, total) {
  const barra = document.getElementById("barra-progresso");
  const progresso = (g / total) * 100;
  barra.style.width = progresso + "%";
}

createBoard();
