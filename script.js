const board = document.getElementById('board');
const movesList = document.getElementById('moves-list');

let knightPosition = null;
let knightMoves = ['b1', 'c3', 'e4', 'f6']; // ou como quiser gerar
let animationInProgress = false;
let animationTimeouts = [];
let currentMoveIndex = 0;

function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const isLight = (row + col) % 2 === 0;
      cell.classList.add(isLight ? 'light' : 'dark');
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener('click', () => {
        clearVisited();
        placeKnight(row, col);
      });

      board.appendChild(cell);
    }
  }
}

function placeKnight(row, col) {
  console.log(row, col)
  // Remove cavalo anterior
  if (knightPosition) {
    const oldIndex = knightPosition.row * 8 + knightPosition.col;
    const oldCell = board.children[oldIndex];
    oldCell.classList.remove('knight');
  }

  // Adiciona classe à nova célula
  const index = row * 8 + col;
  const cell = board.children[index];
  cell.classList.add('knight');

  knightPosition = { row, col };

  // Registra lance
  const moveNotation = 'N' + getChessNotation(row, col);
  addMove(moveNotation);
}


function getChessNotation(row, col) {
  const files = 'abcdefgh';
  return files[col] + (8 - row);
}

function getRowColumn(str) {
  let row = str.charCodeAt(0) - 'a'.charCodeAt(0);
  let col = parseInt(str[1]) - 1;
  return { row, col };
}

function getRowColumnIndex(str) {
  let row = str.charCodeAt(0) - 'a'.charCodeAt(0);
  let col = parseInt(str[1]) - 1;
  // return {row, col};
  return row * 8 + col;
}

function addMove(notation) {
  const li = document.createElement('li');
  li.textContent = notation;
  movesList.appendChild(li);
}

function animateKnightMoves(moves) {
  if (animationInProgress) return; // Não iniciar se já estiver em andamento
  animationInProgress = true;
  currentMoveIndex = 0;

  function moveNext() {
    if (currentMoveIndex >= moves.length) {
      animationInProgress = false;
      return;
    }

    let squareId = moves[currentMoveIndex];
    let { row, col } = getRowColumn(squareId)
    placeKnight(row, col)

    const cell = board.children[getRowColumnIndex(squareId)];

    // Marca a casa como visitada
    cell.classList.add('visited');

    currentMoveIndex++;
    animationTimeouts.push(setTimeout(moveNext, 600)); // tempo entre os movimentos
  }

  moveNext();
}

function clearVisited(){
  // Remove o visited de todas as casas
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('visited');
  });
}

function toggleAnimationA() {
  animateKnightMoves(knightMoves);
}

function toggleAnimation() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const icon = playPauseBtn.querySelector('i');

  if (animationInProgress) {
    // Pausar animação
    animationInProgress = false;
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  } else {
    // Iniciar animação
    
    clearVisited()

    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    animateKnightMoves(knightMoves);
  }
}

createBoard();
