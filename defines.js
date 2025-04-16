// alt + shift + f = formatar
let pontosPisces = false;

function adicionarConstelacao(option) {
  if (option) {
    pontos = [
      { id: 1, x: 580, y: 100 },  // Meissa (cabeça)
      { id: 2, x: 500, y: 200 },  // Betelgeuse (ombro esquerdo)
      { id: 3, x: 660, y: 210 },  // Bellatrix (ombro direito)
      { id: 4, x: 540, y: 310 },  // Alnitak (cinturão 1)
      { id: 5, x: 580, y: 320 },  // Alnilam (cinturão 2)
      { id: 6, x: 620, y: 330 },  // Mintaka (cinturão 3)
      { id: 7, x: 500, y: 460 },  // Saiph (pé esquerdo)
      { id: 8, x: 660, y: 470 },  // Rigel (pé direito)

      // Arco do braço direito (curva para cima)
      { id: 9, x: 720, y: 220 },
      { id: 10, x: 740, y: 190 },
      { id: 11, x: 760, y: 160 },
      { id: 12, x: 770, y: 130 },
      { id: 13, x: 765, y: 100 },
    ];
  }
  else {
    pontos = [
      // {x: 1050, y: 400 },
      // {x: 1170, y: 420 },
      // {x: 1250, y: 460 },
      // {x: 1330, y: 480 },
      // {x: 1400, y: 440 },
      // {x: 1470, y: 470 },
      // {x: 1550, y: 500 },
      // {x: 1170, y: 360 },
      // {x: 1250, y: 300 },

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
  }

  desenharTudo(); // Só desenha fundo + estrelas
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

async function resolverConstelacao(btn) {
  // ordemPiscis = [
  //     "21", "20", "19", "18", "17", "16", "15", "14", "13", "1",
  //     "2", "3", "4", "5", "6", "7",
  //     "8", "9", "10", "11", "12"
  // ];


  const iterations = document.querySelector('input[name="epochs"]').value;
  const populationSize = document.querySelector('input[name="population"]').value;
  const pm = document.querySelector('input[name="pm"]').value;
  const pc = document.querySelector('input[name="pc"]').value;
  const tournamentSize = document.querySelector('input[name="tournamentSize"]').value;
  const pElitism = document.querySelector('input[name="pElitism"]').value;

  if (pontos.length > 2) {
    btn.disabled = true
    ordem = await geneticAlgorithm(iterations, populationSize, pm, pc, tournamentSize, pElitism);
    btn.disabled = false
  }

}

function atualizarBarraProgresso(g, total) {
  const barra = document.getElementById("barra-progresso");
  const progresso = (g / total) * 100;
  barra.style.width = progresso + "%";
}
