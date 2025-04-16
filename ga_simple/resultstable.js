  const linhas = 8;
  const colunas = 4;
  
function ultimacoluna(x){
    let r = [150-80, 150-90, 150-65, 150-70];
    let potparada = [0, 0, 0, 0];
    for(let i=0; i<7; i+=1){ // x[motor-1] = posicaoparada
        potparada[x[i]-1] += motor[i+1];
        if (i<2) {
            potparada[x[i]] += motor[i+1];
        }
    }

    r = r.map((val, i) => val - potparada[i]);
    return r;
}

const r = ultimacoluna(bestIndividual.x);

  // Posições com X vermelho: [linha, coluna]

  const tabela = document.getElementById("my-table");

  for (let i = 0; i < linhas; i++) {
    const row = tabela.insertRow();
    for (let j = 0; j < colunas; j++) {
        const cell = row.insertCell();

        // Checa se essa célula deve estar marcada
        let estaMarcada = (bestIndividual.x[i] -1 === j);
        if(i<2){
            estaMarcada = (bestIndividual.x[i] -1 === j) || (bestIndividual.x[i] === j);
        }

        if (estaMarcada) {
            cell.innerText = "X";
        } else {
            cell.innerHTML = "-";
        }
        cell.style.color = "red";
        cell.style.fontWeight = "bold";
        cell.style.textAlign = "center";

        if (i==7){
            cell.innerText = r[j];
            cell.style.color = "green";
        }

      // Estilo geral da célula
      cell.style.width = "20vw";
      cell.style.height = "37px";
    }
  }