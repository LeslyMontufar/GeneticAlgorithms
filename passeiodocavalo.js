const offsets = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1],
];

function fitness(x) {
    let counter = 0;

    for (let i = 1; i < x.length; i++) {
        if (badvisit(i, x)) {
            return counter;
        }
        counter += 1;
    }

    return counter;
}

function possibilidades(i, opcao, moves) {
    let index = moves[i];
    let row = parseInt(Math.floor(index / lado));
    let col = index % lado;
    //opcao row 1 ou 2; col igual ou diferente
    let bin = opcao.toString(2).padStart(3, '0');
    let num = parseInt(bin[0]) + 1; // 0 ou 1 -> 1 ou 2 // 1%2 = 1  2%2 =0
    let sinalRow = parseInt(bin[1]) * 2 - 1;
    let sinalCol = parseInt(bin[2]) * 2 - 1;
    let newIndex = (row + sinalRow * num) * lado + col + sinalCol * (num % 2 + 1);

    if (newIndex < 0 || newIndex > 63 || moves.slice(0, i).includes(newIndex) || (col + sinalCol * (num % 2 + 1) > 7)) {
        return -1;
    }

    return newIndex;
}

function Warnsdorff(){
    return;
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
    // let option, count;

    for (let i = 1; i < moves.length; i++) {
        // console.log("inicio")
        // j == -1
        // option = Math.floor(Math.random() * 7);
        // do {
        //     j = possibilidades(i, option, moves);
        //     option += 1
        // } while (j == -1)
        // console.log(j)
        // console.log("fim")

        j  = Math.floor(Math.random() * (numCasas-2) + 1);
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

function sumFitness(individuos){
    return individuos.reduce((acumulador, individuo) => acumulador + individuo.fit, 0);
}

function selectRoulette(populacao, pElitism){
    let S = sumFitness(populacao);  // Calcula o total de fitness
    let sorteio = Math.random() * S; // Gera um número aleatório entre 0 e somaTotalFitness

    let acumulador = 0;

    for (let i = 0; i < populacao.length; i++) {
        acumulador += populacao[i].fit;

        if (acumulador >= sorteio) {
            if(i<pElitism){
                return { individuo: populacao[i+1], posicao: i+1 };
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
        let nroCasas = lado*lado;
        let population = generatePopulation(populationSize, nroCasas);
        // console.log(JSON.stringify(population));
        let bestIndividual = population.sort((a, b) => b.fit - a.fit)[0];
        let meanGenerationFit = 0;

        let bestIndividualFitArr = [];
        let meanPopFitArr = [];

        // Usamos setImmediate ou setTimeout para não bloquear a thread principal
        function runIteration(i) {
            if (i >= iterations || bestIndividual.fit >= nroCasas) {
                console.log("Best: ", JSON.stringify(bestIndividual));
                resolve(bestIndividual.x); // Resolve a Promise com o resultado final
                return;
            }

            for (let j = 0; j < Math.floor(populationSize / 2); j++) {
                if (Math.random() < pc) {
                    let { individuo: parent1, posicao: ip1 } = selectRoulette(population, pElitism);
                    let { individuo: parent2, posicao: ip2 } = selectRoulette(population, pElitism);
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