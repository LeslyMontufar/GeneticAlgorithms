let pontosPisces = false;

function adicionarConstelacao() {
  pontos = [
    { id: "1", x: 1050, y: 400 },
    { id: "2", x: 1170, y: 420 },
    { id: "3", x: 1250, y: 460 },
    { id: "4", x: 1330, y: 480 },
    { id: "5", x: 1400, y: 440 },
    { id: "6", x: 1470, y: 470 },
    { id: "7", x: 1550, y: 500 },
    { id: "8", x: 1170, y: 360 },
    { id: "9", x: 1250, y: 300 },
    { id: "10", x: 1330, y: 260 },
    { id: "11", x: 1400, y: 230 },
    { id: "12", x: 1470, y: 200 },
    { id: "13", x: 970, y: 380 },
    { id: "14", x: 890, y: 360 },
    { id: "15", x: 810, y: 340 },
    { id: "16", x: 750, y: 300 },
    { id: "17", x: 690, y: 250 },
    { id: "18", x: 630, y: 220 },
    { id: "19", x: 590, y: 200 },
    { id: "20", x: 550, y: 180 },
    { id: "21", x: 530, y: 160 }
  ];

  desenharTudo(); // Só desenha fundo + estrelas
  pontosPisces = true;
}

function desenharConstelacao(ordem) {
  ctx.strokeStyle = "#00bfff";  // Cor das linhas
  ctx.lineWidth = 2;
  ctx.shadowColor = "#00bfff";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  for (let i = 0; i < ordem.length; i++) {
    const ponto = pontos[ordem[i] - 1];
    if (i === 0) {
      ctx.moveTo(ponto.x, ponto.y);
    } else {
      ctx.lineTo(ponto.x, ponto.y);
    }
  }

  // Fecha o ciclo (último ponto → primeiro)
  const primeiro = pontos[ordem[0] - 1];
  ctx.lineTo(primeiro.x, primeiro.y);
  ctx.stroke();

  ctx.shadowBlur = 0;  // Limpa a sombra após desenhar
}

async function resolverConstelacao() {
  // ordem = [
  //     "21", "20", "19", "18", "17", "16", "15", "14", "13", "1",
  //     "2", "3", "4", "5", "6", "7",
  //     "8", "9", "10", "11", "12"
  // ];
  
  const iterations = document.querySelector('input[name="epochs"]').value;
  const populationSize = document.querySelector('input[name="population"]').value;
  const pc = document.querySelector('input[name="pc"]').value;
  ordem = geneticAlgorithm(iterations, populationSize, pc);
}

