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
        
        
def movimentos_validos(moves, lado):
    if len(moves) >= lado*lado:
        return []
    row,col = moves[-1]
    validos = [(x,y) for x,y in [(row+2,col+1),(row+2,col-1),(row-2,col+1),(row-2,col-1),(row+1,col+2),(row+1,col-2),(row-1,col+2),(row-1,col-2)] 
               if 0 <= x < lado and 0 <= y < lado and (x,y) not in moves]
    return validos
        
def expandir_movimentos(movimentos,lado):
    moves = movimentos.copy()
    while True:
        validos = movimentos_validos(moves,lado)
        if not validos:
            break
        moves.append(random.choice(validos))
    return moves

def crossover(parents,lado):
    parent1, parent2 = parents
    corte = 1
    tamanho = min(len(parent1.genes), len(parent2.genes))
    for i in range(1, tamanho):
        if parent1.genes[i] != parent2.genes[i]:
            corte = i
            break
    base = parent1.genes[:corte]
    return expandir_movimentos(base, lado)

def mutation(parent_genes, lado):
    if len(parent_genes)<=1:
        return parent_genes
    corte = random.randint(1, len(parent_genes)-1)
    return expandir_movimentos(parent_genes[:corte], lado)  # Expand the moves from the cut point
    
def select_parents(population, num_parents):
    # Tournament selection
    selected_parents = []
    for _ in range(num_parents):
        selected_parents.append(random.choice(population))
    return selected_parents 

def geneticAlgorithm(population: list[Individual], population_size, generations, tournament_size, crossover_rate, mutation_rate, elitism_rate, lado, update):
    elitism_num = int(elitism_rate * population_size) if elitism_rate < 1 else int(elitism_rate)   
    print(f"Elitism number: {elitism_num}")
    population.sort(key=lambda ind: ind.fitness, reverse=MAXIMIZAR)  # Sort population by fitness
    
    for generation in range(generations):
        print(f"Generation {generation+1} of {generations}")
        new_population = population[:elitism_num]  # Keep the best individuals based on elitism rate
        
        while len(new_population) < population_size: 
            
            if random.random() < crossover_rate:
                # Select parents: roulette wheel or tournament selection
                parents = select_parents(new_population, 2)
                child = crossover(parents, lado)
                new_population.append(Individual(child))  # Add child to new population
                
            if random.random() < mutation_rate:
                parent, = select_parents(new_population, 1)
                child = mutation(parent.genes, lado)
                new_population.append(Individual(child)) 
                
        population = new_population
        population.sort(key=lambda ind: ind.fitness, reverse=MAXIMIZAR)  # Sort population by fitness
        best_individual = population[0]  # Best individual is the first one after sorting
        
        update({
            'running': True,
            'generation': generation + 1,
            'progress': (generation + 1) / generations * 100,
            'best_individual': {
                'genes': best_individual.genes,
                'fitness': best_individual.fitness
            }
        })
        
        if(best_individual.fitness >= lado*lado):
            print(lado*lado, "reached in generation", generation + 1)
            break  # Stop if the best individual has reached the maximum fitness
        
        print(f"Generation {generation+1}: Best individual: {best_individual.genes}  Best fitness = {best_individual.fitness}")      
    
    return best_individual.genes

def calculate(mutation_rate, crossover_rate, elitism_rate, tournament_size, generations, population_size, lado, update):
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
        moves = expandir_movimentos([get_first_pos()], lado)
        initial_population.append(Individual(moves))
    
    # Run the genetic algorithm
    best_individual_genes = geneticAlgorithm(initial_population, population_size, generations, tournament_size, crossover_rate, mutation_rate, elitism_rate, lado, update)
    
    return best_individual_genes

def main(params:dict, update,close):
    generations = int(params.get("iterations", 150))
    population_size = int(params.get("population", 50))
    mutation_rate = float(params.get("pm", 0.1))
    crossover_rate = float(params.get("pc", 0.9))
    tournament_size = int(params.get("tournamentSize", 3))
    elitism_rate = float(params.get("pElitism", 0.1))    
    lado = int(params.get("lado", 8))
    first_pos = params.get("first_pos", {'row': 0, 'col': 0})
    set_first_pos(first_pos['row'],first_pos['col'])  # Convert position to index
    
    print(params)
 
    best_individual_genes = calculate(mutation_rate, crossover_rate, elitism_rate, tournament_size, generations, population_size, lado, update)
    
    update({'running': False, 'best_individual_genes': best_individual_genes})
    close()

if __name__ == "__main__":
    params = {'iterations': '150', 'population': '50', 'pm': '0.8', 'pc': '0.8', 'tournamentSize': 3, 'pElitism': '5', 'lado': '5', 'first_pos': {'row': 0, 'col': 0}}
    main(params, print, lambda: print("Closed"))