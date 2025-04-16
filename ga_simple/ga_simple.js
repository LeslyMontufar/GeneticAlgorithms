var motor = {
    "1": 20,
    "2": 15,
    "3": 35,
    "4": 40,
    "5": 15,
    "6": 15,
    "7": 10
};

function fitness(x){
    let r = [150-80, 150-90, 150-65, 150-70];
    let potparada = [0, 0, 0, 0];
    for(let i=0; i<7; i+=1){ // x[motor-1] = posicaoparada
        potparada[x[i]-1] += motor[i+1];
        if (i<2) {
            potparada[x[i]] += motor[i+1];
        }
    }

    r = r.map((val, i) => val - potparada[i]);
    if (r.some(v => v < 0)) {
        return 0;
    } 
    let total =  r.reduce((acumulador, v)=> acumulador+v, 0);
    return Math.min(...r)+total;
}

function randomChromosome(bits=10) {
    return Array.from({ length: bits }, () => parseInt(Math.random() > 0.5 ? 1 : 0)); 
}

function decimal(chrom, nx) {
    let bin = chrom.join('');
    let parts = [];
    let size = bin.length/nx;
    for (let i = 0; i < bin.length; i += size) {
        parts.push(bin.slice(i, i + size));
    }
    return parts.map(part => parseInt(part, 2)+1);
}

function fillIndividual(chrom){
    chrom = fixIndividual(chrom);
    let x = decimal(chrom, 7);
    let fit = fitness(x);
    return {chrom, x, fit};
}

function fixIndividual(chrom){
    if (chrom.join('').slice(0, 2)=="11"){
        chrom[1] = "0";
    }
    if (chrom.join('').slice(2, 4)=="11"){
        chrom[3] = "0";
    }
    return chrom;
}

function randomIndividual(bits=10) {
    let chrom = randomChromosome(bits);
    return fillIndividual(chrom); 
}

function mutate(individuo, bits=10) {
    let i = Math.floor(Math.random()*bits);
    individuo.chrom[i] = (individuo.chrom[i] ? 0: 1);
    return fillIndividual(individuo.chrom);
}

function crossover(parent1, parent2, bits=10) {
    let i = Math.floor(Math.random()*bits);
    let chrom1 = [...parent1.chrom.slice(0, i), ...parent2.chrom.slice(i)];  // Combina as duas metades
    let chrom2 = [...parent2.chrom.slice(0, i), ...parent1.chrom.slice(i)];
    return [fillIndividual(chrom1), fillIndividual(chrom2)];
}

function sumFitness(individuos){
    return individuos.reduce((acumulador, individuo) => acumulador + individuo.fit, 0);
}

function selectRoulette(populacao){
    let S = sumFitness(populacao);  // Calcula o total de fitness
    let sorteio = Math.random() * S; // Gera um número aleatório entre 0 e somaTotalFitness

    let acumulador = 0;

    for (let i = 0; i < populacao.length; i++) {
        acumulador += populacao[i].fit;

        if (acumulador >= sorteio) {
            return { individuo: populacao[i], posicao: i };  // Retorna o indivíduo e a posição
        }
    }
}

function tournamentSelection(population, tournamentSize=3) {
    let bestIndex = null;
    let bestFitness = -Infinity;

    for (let i = 0; i < tournamentSize; i++) {
        let randomIndex = Math.floor(Math.random() * (population.length-1) + 1); // evita pegar o primeiro individuo, pois ele foi o melhor da geracao passada

        if (population[randomIndex].fit > bestFitness) {
            bestFitness = population[randomIndex].fit;
            bestIndex = randomIndex;
        }
    }

    return {individuo: population[bestIndex], posicao: bestIndex};
}

function geneticAlgorithm(iterations = 100, populationSize = 50) {
    let population = Array.from({ length: populationSize }, () => randomIndividual(2*7));
    console.log(population)
    let pc = 0.1, pm = 0.01;

    let bestIndividual = 0;
    let meanGenerationFit = 0;

    let bestIndividualFitArr = [];
    let meanPopFitArr = [];  

    for (let i = 0; i < iterations; i++) {        
        for(let j=0; j<Math.floor(populationSize/2); j++){
            if(Math.random()<pc){
                let { individuo: parent1, posicao: ip1 } = tournamentSelection(population);
                let { individuo: parent2, posicao: ip2 } = tournamentSelection(population);
                let childs = crossover(parent1, parent2, 10)
                population[ip1] = childs[0];
                population[ip2] = childs[1];
            }
            if(Math.random()<pm){
                let {individuo: parent, posicao: ip} = tournamentSelection(population);
                population[ip] = mutate(parent, 10);
            }
        }

        bestIndividual = population.sort((a, b) => b.fit - a.fit)[0]; // ordena do maior para o menor
        meanGenerationFit = population.reduce((acumulador, individuo) => acumulador + individuo.fit, 0)/populationSize;

        bestIndividualFitArr.push(bestIndividual.fit);
        meanPopFitArr.push(meanGenerationFit);
    }
    return {bestIndividualFitArr, meanPopFitArr, bestIndividual};
}