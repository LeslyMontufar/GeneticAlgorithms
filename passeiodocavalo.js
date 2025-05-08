
function fitness(x) {
    let row, col, rowOld, colOld;
    let counter = -1;

    for (let i = 1; i < x.length; i++) {
        row = parseInt(Math.floor(x[i] / 8));
        col = x[i] % 8;
        if (Math.abs(row - rowOld) == 1) {
            if (Math.abs(col - colOld) != 3) return counter;
        } else if (Math.abs(row - rowOld) == 3) {
            if (Math.abs(col - colOld) != 1) return counter;
        } else {
            return counter;
        }
        console.log("conseguiu!")

        rowOld = row;
        colOld = col;
        counter+=1;
    }

    return counter+1;
}

function fixIndividual(v){ // nao esta funcionando
    let initial = knightPosition.row * 8 + knightPosition.col;
    [v[0], v[initial]] = [v[initial], v[0]];
    return v;
}

function randomChromosome(numCities) {
    let cities = Array.from({ length: numCities }, (_, i) => i);

    for (let i = cities.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i));
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

async function geneticAlgorithm(iterations = 100, populationSize = 500, pm = 0.8, pc = 0.8, tournamentSize = 3, pElitism = 5) {
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
                console.log(JSON.stringify(bestIndividual));
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