
function fitness(x) {
    let row, col, rowOld=knightPosition.row, colOld = knightPosition.col;
    let counter = -1;

    for (let i = 1; i < x.length; i++) {
        row = parseInt(Math.floor(x[i] / 8));
        col = x[i] % 8;
        if (Math.abs(row - rowOld) == 1) {
            if (Math.abs(col - colOld) != 2) return counter;
        } else if (Math.abs(row - rowOld) == 2) {
            if (Math.abs(col - colOld) != 1) return counter;
        } else {
            return counter;
        }

        rowOld = row;
        colOld = col;
        counter += 1;
    }

    return counter + 1;
}

function possibilidades(index, opcao) {

    let row = parseInt(Math.floor(index / 8));
    let col = index % 8;
    //opcao row 1 ou 2; col igual ou diferente
    let bin = opcao.toString(2).padStart(3, '0');
    let num = parseInt(bin[0])+1; // 0 ou 1 -> 1 ou 2 // 1%2 = 1  2%2 =0
    let sinalRow = parseInt(bin[1])*2-1;
    let sinalCol = parseInt(bin[2])*2-1;
    let newIndex = (row + sinalRow*num)*8+ col + sinalCol*(num%2 +1);
    if(newIndex<0)
        newIndex = (row + num)*8+ col + (num%2 +1);
    return newIndex;
}


function fixIndividual(v) {
    let initial = knightPosition.row * 8 + knightPosition.col;
    let idx = v.indexOf(initial); // encontra onde está o valor da posição inicial
    if (idx !== -1 && idx !== 0) {
        [v[0], v[idx]] = [v[idx], v[0]]; // troca se não estiver já na posição 0
    }
    return v;
}

function randomChromosome(numCities) {
    let cities = Array.from({ length: numCities }, (_, i) => i);

    for (let i = 1; i<cities.length/2; i++) {
        const j = possibilidades(cities[i-1],Math.floor(Math.random() * 8));
        [cities[i], cities[j]] = [cities[j], cities[i]]; // cities é vetor, trocando posicoes entre si
    }

    cities = fixIndividual(cities);
    return cities;
}

function fillIndividual(x) {
    let fit = fitness(x);
    return { x, fit };
}

function randomIndividual(ids) {
    let x = randomChromosome(ids);
    return fillIndividual(x);
}

function mutate(cities, ids) {
    let i = Math.floor(Math.random() * (ids - 1));
    let j = Math.floor(Math.random() * (ids - 1));
    [cities.x[i], cities.x[j]] = [cities.x[j], cities.x[i]];

    cities.x = fixIndividual(cities.x);
    return fillIndividual(cities.x);
}

function cycleCrossover(parent1, parent2, ids) {
    let start = parent1.x[0], last = parent2.x[0];
    let index = 0;
    let visited = Array.from({ length: ids }, () => false);
    visited[0] = true;

    do {
        index = parent1.x.indexOf(last);
        last = parent2.x[index];
        visited[index] = true;
    } while (last != start);

    let x1 = [...parent1.x];
    let x2 = [...parent2.x];
    for (let i = 0; i < ids; i++) {
        if (!visited[i]) {
            x1[i] = parent2.x[i];
            x2[i] = parent1.x[i];
        }
    }

    x1 = fixIndividual(x1);
    x2 = fixIndividual(x2);
    return [fillIndividual(x1), fillIndividual(x2)];
}

function sumFitness(individuos) {
    return individuos.reduce((acumulador, individuo) => acumulador + individuo.fit, 0);
}

function tournamentSelection(population, tournamentSize = 3, pElitism) {
    let bestIndex = null;
    let bestFitness = +Infinity;
    let elitismBestX = Math.floor(population.length * pElitism / 100);

    for (let i = 0; i < tournamentSize; i++) {
        let randomIndex = Math.floor(Math.random() * (population.length - 1 - elitismBestX) + elitismBestX); // evita pegar o primeiro individuo, pois ele foi o melhor da geracao passada
        if (population[randomIndex].fit < bestFitness) {
            bestFitness = population[randomIndex].fit;
            bestIndex = randomIndex;
        }
    }

    return { individuo: population[bestIndex], posicao: bestIndex };
}

function generatePopulation(popSize, numCities) {
    return Array.from({ length: popSize }, () => randomIndividual(numCities));
}

async function geneticAlgorithm(iterations = 10, populationSize = 5, pm = 0.8, pc = 0.8, tournamentSize = 3, pElitism = 5) {
    return new Promise((resolve) => {
        const nroCasas = 64;
        let population = generatePopulation(populationSize, nroCasas);
        console.log(JSON.stringify(population));
        let bestIndividual = null;
        let meanGenerationFit = 0;

        let bestIndividualFitArr = [];
        let meanPopFitArr = [];

        // Usamos setImmediate ou setTimeout para não bloquear a thread principal
        function runIteration(i) {
            if (i >= iterations) {
                console.log("Best: ",JSON.stringify(bestIndividual));
                resolve(bestIndividual.x); // Resolve a Promise com o resultado final
                return;
            }

            for (let j = 0; j < Math.floor(populationSize / 2); j++) {
                if (Math.random() < pc) {
                    let { individuo: parent1, posicao: ip1 } = tournamentSelection(population, tournamentSize, pElitism);
                    let { individuo: parent2, posicao: ip2 } = tournamentSelection(population, tournamentSize, pElitism);
                    let childs = cycleCrossover(parent1, parent2, nroCasas);
                    population[ip1] = childs[0];
                    population[ip2] = childs[1];
                }
                if (Math.random() < pm) {
                    let { individuo: parent, posicao: ip } = tournamentSelection(population, tournamentSize, pElitism);
                    population[ip] = mutate(parent, nroCasas);
                }
            }

            bestIndividual = population.sort((a, b) => b.fit - a.fit)[0];
            meanGenerationFit = population.reduce((acumulador, individuo) => acumulador + individuo.fit, 0) / populationSize;

            bestIndividualFitArr.push(bestIndividual.fit);
            meanPopFitArr.push(meanGenerationFit);

            knightMoves = bestIndividual.x;
            atualizarBarraProgresso(i + 1, iterations);

            // Processa a próxima iteração de forma assíncrona
            setTimeout(() => runIteration(i + 1), 0);
        }

        // Inicia o processamento
        runIteration(0);
    });
}