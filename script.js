const board = document.getElementById('board');
const movesList = document.getElementById('moves-list');
const playPauseBtn = document.getElementById('playPauseBtn');
const icon = playPauseBtn.querySelector('i');
const bestFitnessID = document.getElementById('best-fitness');
const currentGenID = document.getElementById('current-gen');

let lado = document.querySelector('input[name="tabuleiro"]').value;

document.getElementById('tabuleiro').addEventListener('input', (e) => {
  const novoLado = parseInt(e.target.value);
  if (!isNaN(novoLado) && novoLado > 0) {
    lado = novoLado; // <-- atualiza a variável global
    createBoard(lado); // <-- função que desenha o tabuleiro
  }
});


let knightPosition = null;
let knightMoves = [0, 17, 2, 24]; // ou como quiser gerar
let animationInProgress = false;
let animationTimeouts = [];
let currentMoveIndex = 0;
let justChecking = false;

function createBoard(lado) {
  board.innerHTML = '';
  // board.style.gridTemplateColumns = `repeat(${lado}, 1fr)`;
  document.documentElement.style.setProperty('--lado', lado);

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
  const files = 'abcdefghijkl';
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

function clearMovesList() {
  movesList.innerHTML = '';
}

function badvisit(currentMoveIndex, moves) {
  if (currentMoveIndex == 0) {
    return false;
  }
  let { row: rowOld, col: colOld } = getRowColumnFromIndex(moves[currentMoveIndex - 1])
  let { row, col } = getRowColumnFromIndex(moves[currentMoveIndex])

  if (Math.abs((row - rowOld) * (col - colOld)) == 2) {
    return false;
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
    cell.classList.remove('just-checking');
    justChecking = false
  });
}

// function runGeneticAndAnimate(){
//   numValidMoves(2, teste)
// }

async function runGeneticAndAnimate() {
  try {
    playPauseBtn.disabled = true;

    // Mostra estado de processamento
    icon.classList.replace('fa-play', 'fa-spinner');
    icon.classList.add('fa-spin');

    // Aguarda o algoritmo genético terminar
    let epochs = document.querySelector('input[name="epochs"]').value;
    let population = document.querySelector('input[name="population"]').value;
    let pm = document.querySelector('input[name="pm"]').value;
    let pc = document.querySelector('input[name="pc"]').value;
    let pElitism = document.querySelector('input[name="pElitism"]').value;
    console.log(epochs, population)
    knightMoves = await geneticAlgorithm(iterations = epochs, population = population, pm = pm, pc = pc, tournamentSize = 3, pElitism = pElitism);
    // knightMoves = await geneticAlgorithm();

    // Prepara para animação
    icon.classList.replace('fa-spinner', 'fa-pause');
    icon.classList.remove('fa-spin');
    playPauseBtn.disabled = false;
    clearMovesList();
    clearVisited();

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
  epochsID.disabled = false;
  populationID.disabled = false;
  tabuleiro.disabled = false;
}

function toggleAnimation() {
  if (animationInProgress) {
    // Lógica para pausar
    stopAnimation();
  } else {
    epochsID.disabled = true;
    populationID.disabled = true;
    tabuleiro.disabled = true;

    runGeneticAndAnimate();
  }
}

function atualizarBarraProgresso(g, total, bestIndividual) {
  const barra = document.getElementById("barra-progresso");
  const progresso = (g / total) * 100;
  barra.style.width = progresso + "%";

  bestFitnessID.innerHTML = bestIndividual.fit % 100;
  currentGenID.innerHTML = g;


}

createBoard(lado);
