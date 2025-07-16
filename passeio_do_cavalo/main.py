import time
import random

import random
from fitness_function import fitness_function 
from config import *

class Individual:
    def __init__(self, genes):
        self.genes = genes
        self.fitness = 0
        self.evaluate_fitness()

    def evaluate_fitness(self):
        self.fitness =  fitness_function(self.genes)

def crossover(parents):
    parent1, parent2 = parents
    corte = 1
    tamanho = min(len(parent1.genes), len(parent2.genes))
    for i in range(1, tamanho):
        if parent1.genes[i] != parent2.genes[i]:
            corte = i-1
            break
    base = parent1.genes[:corte]
    return expandir_movimentos(base)

def mutation(parent_genes):
    if len(parent_genes)<=1:
        return parent_genes
    corte = random.randint(1, len(parent_genes)-1)
    return expandir_movimentos(parent_genes[:corte], lado=get_lado())  # Expand the moves from the cut point
    
def select_parents(population, num_parents, tournament_size=3):
    # Tournament selection
    selected_parents = []
    for _ in range(num_parents):  # Select two parents
        # gera um torneio de 3 individuos (indices)
        tournament_index = random.sample(range(0,len(population)), tournament_size)
        tournament_index.sort(key=lambda i: population[i].fitness, reverse=False)
        best_individual = population.pop(tournament_index[0])  # Select the best individual from the tournament
        selected_parents.append(best_individual)
    return selected_parents 

def geneticAlgorithm(population: list[Individual], population_size, generations, tournament_size, crossover_rate, mutation_rate, elitism_rate, update):
    population.sort(key=lambda ind: ind.fitness, reverse=MAXIMIZAR)  # Sort population by fitness
    
    for generation in range(generations):
        new_population = population[:int(elitism_rate * len(population))]  # Keep the best individuals based on elitism rate
        
        while len(new_population) < population_size: 
            
            if random.random() < crossover_rate:
                # Select parents: roulette wheel or tournament selection
                parents = select_parents(population, 2, tournament_size)
                child = crossover(parents)
                new_population.append(Individual(child))  # Add child to new population
                
            if random.random() < mutation_rate:
                parent, = select_parents(population, 1, tournament_size)
                child = mutation(parent.genes)
                new_population.append(Individual(child)) 
        population.sort(key=lambda ind: ind.fitness, reverse=MAXIMIZAR)  # Sort population by fitness
        best_individual = population[0]  # Best individual is the first one after sorting
        
        update({
            'running': True,
            'generation': generation + 1,
            'progress': (generation + 1) / generations * 100,
            'best_individual': best_individual
        })
        
        if(best_individual.fitness >= lado*lado):
            break  # Stop if the best individual has reached the maximum fitness
        
        print(f"Generation {generation+1}: Best individual: {best_individual.genes}  Best fitness = {best_individual.fitness}")      
    
    # best_individual = max(population, key=lambda ind: ind.fitness)
    return best_individual

def info(population, genereation):
    print(f"Population for generation {genereation}:")
    for ind in population:
        print(ind.genes, "Fitness:", ind.fitness)
        
def movimentos_validos(moves, lado=get_lado()):
    if len(moves) >= lado*lado:
        return []
    row,col = moves[-1]
    validos = [(x,y) for x,y in [(row+2,col+1),(row+2,col-1),(row-2,col+1),(row-2,col-1),(row+1,col+2),(row+1,col-2),(row-1,col+2),(row-1,col-2)] 
               if 0 <= x < lado and 0 <= y < lado and (x,y) not in moves]
    return validos
        
def expandir_movimentos(movimentos,lado=get_lado()):
    moves = movimentos.copy()
    while True:
        validos = movimentos_validos(moves,lado)
        if not validos:
            break
        moves.append(random.choice(validos))
    return moves

def calculate(mutation_rate, crossover_rate, elitism_rate, tournament_size, generations, population_size, update):
    """
    Calculate the best individual based on the genetic algorithm parameters.
    
    Args:
        mutation_rate (float): Probability of mutation for each individual.
        crossover_rate (float): Probability of crossover between parents.
        generations (int): Number of generations to evolve.
        population_size (int): Size of the population.
    
    Returns:
        Individual: The best individual found in the population.
    """
    # Initialize a random population    
    initial_population = []
    for _ in range(population_size):
        moves = expandir_movimentos([get_first_pos()], lado=get_lado())
        initial_population.append(Individual(moves))
    
    # Run the genetic algorithm
    best_individual = geneticAlgorithm(initial_population, population_size, generations, tournament_size, crossover_rate, mutation_rate, elitism_rate, update)
    
    return best_individual

if __name__ == "__main__":
    # Example usage
    set_lado(5)  # Set the board size
    mutation_rate = 0.1
    crossover_rate = 0.9
    generations = 100
    population_size = 5
    elitism_rate = 0.1
    element_count = lado * lado 
    set_first_pos(0,0)  # Set the first position index globally
    best_individual = calculate(mutation_rate, crossover_rate, elitism_rate, generations, population_size, element_count, update)
    print("Best individual:", best_individual.genes, "Fitness:", best_individual.fitness)

def main(params:dict, update,close):
    generations = int(params.get("iterations", 150))
    population_size = int(params.get("population", 50))
    mutation_rate = float(params.get("pm", 0.1))
    crossover_rate = float(params.get("pc", 0.9))
    tournament_size = int(params.get("tournamentSize", 3))
    elitism_rate = float(params.get("pElitism", 0.1))    
    set_lado(int(params.get("lado", 10)))
    first_pos = params.get("first_pos", {'row': 0, 'col': 0})
    set_first_pos(first_pos['row'],first_pos['col'])  # Convert position to index
    
    print(params)
 
    best_individual = calculate(mutation_rate, crossover_rate, elitism_rate, tournament_size, generations, population_size, update)
    
    update({'running': False})
    close()

