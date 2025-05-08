function fitness(x) {
    let dist = 0, dx, dy;
    for (let i = 0; i < pontos.length - 1; i += 1) { // x[motor-1] = posicaoparada
        dx = (pontos[x[i] - 1].x - pontos[x[i + 1] - 1].x);
        dy = (pontos[x[i] - 1].y - pontos[x[i + 1] - 1].y);
        dist += Math.sqrt(dx * dx + dy * dy);
    }
    dx = (pontos[x[pontos.length - 1] - 1].x - pontos[x[0] - 1].x);
    dy = (pontos[x[pontos.length - 1] - 1].y - pontos[x[0] - 1].y);
    dist += Math.sqrt(dx * dx + dy * dy);
    return dist;
}
function randomChromosome(numCities) {    
    const cities = Array.from({ length: numCities }, (_, i) => i + 1);
    for (let i = cities.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cities[i], cities[j]] = [cities[j], cities[i]];
    }
    return cities;
}

function fillIndividual(x) {
    let fit = fitness(x);
    return { x, fit };
}

function randomIndividual(ids = 10) {
    let x = randomChromosome(ids);
    return fillIndividual(x);
}

function mutate(cities, ids) {
    let i = Math.floor(Math.random()*(ids-1));
    let j = Math.floor(Math.random()*(ids-1));
    [cities.x[i], cities.x[j]] = [cities.x[j], cities.x[i]];
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
    return [fillIndividual(x1), fillIndividual(x2)];
}

function sumFitness(individuos) {
    return individuos.reduce((acumulador, individuo) => acumulador + individuo.fit, 0);
}

function tournamentSelection(population, tournamentSize = 3, pElitism) {
    let bestIndex = null;
    let bestFitness = +Infinity;
    let elitismBestX = Math.floor(population.length*pElitism/100);

    for (let i = 0; i < tournamentSize; i++) {
        let randomIndex = Math.floor(Math.random() * (population.length - 1 - elitismBestX) + elitismBestX); // evita pegar o primeiro individuo, pois ele foi o melhor da geracao passada
        if (population[randomIndex].fit < bestFitness) {
            bestFitness = population[randomIndex].fit;
            bestIndex = randomIndex;
        }
    }

    return { individuo: population[bestIndex], posicao: bestIndex };
}

function generatePopulationDifferentIndividuals(popSize, numCities) {
    const population = [];
    const uniqueSet = new Set();

    while (population.length < popSize) {
        const chromo = randomChromosome(numCities);
        const key = chromo.join(',');
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            population.push(fillIndividual(chromo));
        }
    }

    return population;
}

function generatePopulation(popSize, numCities) {
    return Array.from({length: popSize}, () => randomIndividual(numCities));
}

async function geneticAlgorithm(iterations = 100, populationSize = 50, pm=0.1, pc = 0.8, tournamentSize, pElitism) { // pontos é var global
    let population = generatePopulation(populationSize, pontos.length);
    console.log(JSON.stringify(population));
    let bestIndividual = null;
    let meanGenerationFit = 0;

    let bestIndividualFitArr = [];
    let meanPopFitArr = [];

    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < Math.floor(populationSize / 2); j++) {
            if (Math.random() < pc) {
                let { individuo: parent1, posicao: ip1 } = tournamentSelection(population, tournamentSize, pElitism);
                let { individuo: parent2, posicao: ip2 } = tournamentSelection(population, tournamentSize, pElitism);
                let childs = cycleCrossover(parent1, parent2, pontos.length);
                population[ip1] = childs[0];
                population[ip2] = childs[1];
            }
            if(Math.random() < pm){
                let {individuo: parent, posicao: ip} = tournamentSelection(population, tournamentSize, pElitism);
                population[ip] = mutate(parent, pontos.length);
            }
        }

        bestIndividual = population.sort((a, b) => a.fit - b.fit)[0]; // ordena do menor para o maior
        meanGenerationFit = population.reduce((acumulador, individuo) => acumulador + individuo.fit, 0) / populationSize;

        bestIndividualFitArr.push(bestIndividual.fit);
        meanPopFitArr.push(meanGenerationFit);

        ordem = bestIndividual.x;
        desenharTudo(i+1);
        atualizarBarraProgresso(i + 1, iterations);

        await new Promise(resolve => setTimeout(resolve, 10)); // pequena pausa pra animar

    }
    return bestIndividual.x;
}