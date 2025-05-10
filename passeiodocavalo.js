let offsets = [
    -2*lado -1, -2*lado+1,
    -1*lado -2, -1*lado+2,
    1*lado -2, 1*lado+2,
    2*lado -1, 2*lado+1,
];

function fitness(x) {
    let score = 1;

    for (let i = 1; i < x.length; i++) {
        if (badvisit(i, x)) {
            return score; //
        }
        score += 1 + (8 - numValidMoves(i, x))*100;
    }

    return score;
}

function isValid(moves_anteriores, candidateMove) {
    let { row: rowOld, col: colOld } = getRowColumnFromIndex(moves_anteriores[moves_anteriores.length - 1]);
    let { row, col } = getRowColumnFromIndex(candidateMove);
    return !(candidateMove < 0 || candidateMove > 63 || moves_anteriores.includes(candidateMove) || Math.abs((row - rowOld) * (col - colOld)) == 2);
}

function numValidMoves(i, moves) { //Warnsdorff
    let nValidMoves = 0;
    let currentposition = moves[i];
    for (let j = 0; i < offsets.length; i++) {
        if (isValid(moves_anteriores = moves.slice(0, i), candidateMove = currentposition + offsets[j])) {
            nValidMoves += 1;
        }
    }
    return nValidMoves;
}


function fixIndividual(v) {
    let initial = knightPosition.row * lado + knightPosition.col;
    let idx = v.indexOf(initial); // encontra onde está o valor da posição inicial
    if (idx !== -1 && idx !== 0) {
        [v[0], v[idx]] = [v[idx], v[0]]; // troca se não estiver já na posição 0
    }
    return v;
}

function randomChromosome(numCasas = 64) {
    let moves = Array.from({ length: numCasas }, (_, i) => i);
    let j = -1;

    for (let i = 1; i < moves.length; i++) {
        j = Math.floor(Math.random() * (numCasas - 2) + 1);
        [moves[i], moves[j]] = [moves[j], moves[i]]; // cities é vetor, trocando posicoes entre si
    }

    moves = fixIndividual(moves);
    return moves;
}

function fillIndividual(x) {
    let fit = fitness(x);
    return { x, fit };
}

function randomIndividual(ids) {
    let x = randomChromosome(ids);
    return fillIndividual(x);
}

function mutate(cities, qtd) {
    let i = Math.floor(Math.random() * (qtd - 2) + 1); // evita pegar o primeiro elemento
    let j = Math.floor(Math.random() * (qtd - 2) + 1);
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

function sumFitness(individuos) {
    return individuos.reduce((acumulador, individuo) => acumulador + individuo.fit, 0);
}

function selectRoulette(populacao, nonen, pElitism) {
    let S = sumFitness(populacao);  // Calcula o total de fitness
    let sorteio = Math.random() * S; // Gera um número aleatório entre 0 e somaTotalFitness

    let acumulador = 0; // (nro de mov validos) |63| (+) |2*63|

    for (let i = 0; i < populacao.length; i++) {
        acumulador += populacao[i].fit;

        if (acumulador >= sorteio) {
            if (i < pElitism) {
                return { individuo: populacao[i + 1], posicao: i + 1 };
            }
            return { individuo: populacao[i], posicao: i };  // Retorna o indivíduo e a posição
        }
    }
}

function generatePopulation(popSize, numCities) {
    return Array.from({ length: popSize }, () => randomIndividual(numCities));
}

async function geneticAlgorithm(iterations = 1500, populationSize = 300, pm = 0.1, pc = 0.8, tournamentSize = 3, pElitism = 1) {
    return new Promise((resolve) => {
        console.log(iterations, populationSize, pm, pc, tournamentSize, pElitism)

        let nroCasas = lado * lado;
        let population = generatePopulation(populationSize, nroCasas);
        // console.log(JSON.stringify(population));
        let bestIndividual = population.sort((a, b) => b.fit - a.fit)[0];
        let meanGenerationFit = 0;

        let bestIndividualFitArr = [];
        let meanPopFitArr = [];

        // Usamos setImmediate ou setTimeout para não bloquear a thread principal
        function runIteration(i) {
            if (i >= iterations || bestIndividual.fit%100 >= nroCasas) {
                console.log("Best: ", JSON.stringify(bestIndividual));
                resolve(bestIndividual.x); // Resolve a Promise com o resultado final
                return;
            }

            for (let j = 0; j < Math.floor(populationSize / 2); j++) {
                if (Math.random() < pc) {
                    let { individuo: parent1, posicao: ip1 } = selectRoulette(population, tournamentSize, pElitism);
                    let { individuo: parent2, posicao: ip2 } = selectRoulette(population, tournamentSize, pElitism);
                    let childs = cycleCrossover(parent1, parent2, nroCasas);
                    population[ip1] = childs[0];
                    population[ip2] = childs[1];
                }
                if (Math.random() < pm) {
                    let { individuo: parent, posicao: ip } = selectRoulette(population, tournamentSize, pElitism);
                    population[ip] = mutate(parent, nroCasas);
                }


            }

            bestIndividual = population.sort((a, b) => b.fit - a.fit)[0];
            // meanGenerationFit = population.reduce((acumulador, individuo) => acumulador + individuo.fit, 0) / populationSize;

            // bestIndividualFitArr.push(bestIndividual.fit);
            // meanPopFitArr.push(meanGenerationFit);

            knightMoves = bestIndividual.x;

            atualizarBarraProgresso(i + 1, iterations, bestIndividual);

            // Processa a próxima iteração de forma assíncrona
            setTimeout(() => runIteration(i + 1), 0);
        }

        // Inicia o processamento
        runIteration(0);
    });
}