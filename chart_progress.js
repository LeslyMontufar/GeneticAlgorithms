var {bestIndividualFitArr, meanPopFitArr, bestIndividual} = geneticAlgorithm(200,50);

document.getElementById("best-individual").innerText = `Melhor Indivíduo: ${JSON.stringify(bestIndividual, null, 2)}`;


function transparentize(rgb, alpha) {
    return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
}

const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const labels = Array.from({ length: 100 }, (_, i) => (i % 10 === 0 ? i : ''));

const data = {
    labels: labels,
    datasets: [
    {
        label: 'bestIndividualFitArr',
        data: bestIndividualFitArr,
        borderColor: CHART_COLORS.red,
        backgroundColor: transparentize(CHART_COLORS.red, 0.5),
    },
    {
        label: 'meanPopFitArr',
        data: meanPopFitArr,
        borderColor: CHART_COLORS.blue,
        backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
    }
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'GA com torneio e elitismo'
        }
      }
    },
  };

const ctx = document.getElementById('gachart').getContext('2d');
new Chart(ctx, config);