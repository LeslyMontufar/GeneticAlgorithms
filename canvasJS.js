  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let pontos = [];
  let ordem = null;

  // Ajusta o canvas para ocupar toda a tela
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    desenharTudo();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Adiciona ponto ao clicar
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pontos.push({ x, y });
    desenharTudo();
  });

  function seededRandomGenerator(seed) {
    let x = seed % 2147483647;
    if (x <= 0) x += 2147483646;

    return function () {
        x = (x * 16807) % 2147483647;
        return (x - 1) / 2147483646;
    };  
  }

  // Desenha o fundo com estrelas pequenas
  function desenharFundoEstrelado() {
    const random = seededRandomGenerator(12345);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrelas aleatórias
    for (let i = 0; i < 200; i++) {
      const x = random() * canvas.width;
      const y = random() * canvas.height;
      const r = random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fill();
    }
  }

  // Desenha os pontos inseridos pelo usuário
  function desenharPontos() {
    pontos.forEach((ponto, index) => {
      // ponto como estrela brilhante
        ctx.beginPath();
        ctx.arc(ponto.x, ponto.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#00bfff";
        ctx.shadowColor = "#00bfff";
        ctx.shadowBlur = 10;
        ctx.fill();

        // número do ponto
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(index + 1, ponto.x + 8, ponto.y - 8);
    });
  }

  // Redesenha tudo
  function desenharTudo(generation = null) {
    desenharFundoEstrelado();
    desenharPontos();
    if (ordem) {
        desenharConstelacao(ordem);
    }
    // requestAnimationFrame(desenharTudo);
    if (generation !== null) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(`Geração: ${generation}`, canvas.width - 200 - 20, 50);  // canto superior esquerdo
    }
  }