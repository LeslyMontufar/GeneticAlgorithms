function fitness(x) {
    return Math.abs(x * Math.sin(Math.sqrt(Math.abs(x))));
}

function randomChromosome() {
    return Array.from({ length: 10 }, () => parseInt(Math.random() > 0.5 ? 1 : 0)); 
}

function fillIndividual(chrom){
    let x = parseInt(chrom.join(''), 2)*0.5;
    let fit = fitness(x);
    return {chrom, x, fit};
}

function randomIndividual() {
    let chrom = randomChromosome();
    return fillIndividual(chrom); 
}

function mutate(individuo) {
    let i = Math.floor(Math.random()*10);
    individuo.chrom[i] = (individuo.chrom[i] ? 0: 1);
    return fillIndividual(individuo.chrom);
}

function crossover(parent1, parent2) {
    let i = Math.floor(Math.random()*10);
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

function geneticAlgorithm(iterations = 100, populationSize = 50) {
    let population = Array.from({ length: populationSize }, randomIndividual);
    let pc = 0.1, pm = 0.01;

    let generationsArr = [];
    let bestXArr = [];
    let fxArr = [];
    let meanArr = [];    

    for (let i = 0; i < iterations; i++) {        
        for(let j=0; j<populationSize/2; j++){
            if(Math.random()<pc){
                let { individuo: parent1, posicao: ip1 } = selectRoulette(population);
                let { individuo: parent2, posicao: ip2 } = selectRoulette(population);
                let childs = crossover(parent1, parent2)
                population[ip1] = childs[0];
                population[ip2] = childs[1];
            }
            if(Math.random()<pm){
                let {individuo: parent, posicao: ip} = selectRoulette(population);
                population[ip] = mutate(parent);
            }
        }

        bestIndividual = population.sort((a, b) => fitness(a) - fitness(b))[0];
        meanGeneration = population.reduce((acumulador, individuo) => acumulador + individuo.fit, 0)/populationSize;

        generationsArr.push(i);
        bestXArr.push(bestIndividual.x);
        fxArr.push(bestIndividual.fit);
        meanArr.push(meanGeneration);
    }
    
    // return {generationsArr, bestXArr, fxArr, meanArr};
    return bestXArr;
}