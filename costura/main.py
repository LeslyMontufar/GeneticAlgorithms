import random
from math import floor
from config import *
from fitness_function import fitness_function_no_rotation as fitness_function

class Individual:
    def __init__(self, genes):
        self.genes = [[int(y), int(x), int(phase)] for y, x, phase in genes]  # Ensure genes are integers
        self.elements = []
        self.fitness, self.tecido = 0, 0
        self.evaluate_fitness()

    def evaluate_fitness(self):
        self.fitness, self.tecido =  fitness_function(self.genes)
        
def select_parents(population, num_parents, elitism_num=3):
    # Tournament selection
    tournament_size = 3
    selected_parents = []
    for _ in range(num_parents):  # Select two parents
        # gera um torneio de 3 individuos (indices)
        tournament_index = random.sample(range(elitism_num,len(population)), tournament_size)
        tournament_index.sort(key=lambda i: population[i].fitness, reverse=True)
        best_individual = population.pop(tournament_index[0])  # Select the best individual from the tournament
        selected_parents.append(best_individual)
    return selected_parents 

def crossover(parents):
    beta = random.random()
    parent1, parent2 = parents
    child1_genes = [beta*parent1.genes[i] + (1-beta)*parent2.genes[i] for i in range(len(parent1.genes))]
    child2_genes = [(1-beta)*parent1.genes[i] + beta*parent2.genes[i] for i in range(len(parent1.genes))]
    return Individual(child1_genes), Individual(child2_genes)

def geneticAlgorithm(population, generations, crossover_rate, mutation_rate):
    for generation in range(generations):
        for _ in range(len(population)//2):
            if random.random() < crossover_rate:
                # Select parents: roulette wheel or tournament selection
                parents = select_parents(population, 2)
                childs = crossover(parents)
                population.extend(childs)
            if random.random() < mutation_rate:
                parent, = select_parents(population, 1)
                # Choose a random gene to mutate
                mutation_index = random.randint(0, len(parent.genes) - 1)
                parent.genes[mutation_index] = [random.randint(0,TECIDO_ALTURA-1), random.randint(0,TECIDO_LARGURA-1), random.randint(0,360-1)]
                parent.evaluate_fitness()
                population.append(parent)  # Add mutated individual back to population
                
        population.sort(key=lambda ind: ind.fitness, reverse=True)  # Sort population by fitness
        best_individual = population[0]
    return best_individual

def calculate(mutation_rate, crossover_rate, generations, population_size, element_count):
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
    initial_population = [Individual([[random.int(0,TECIDO_ALTURA-1), random.randint(0,TECIDO_LARGURA-1), random.randint(0,360-1)] for _ in range(element_count)]) for _ in range(population_size)]
    print(initial_population)
    
    # Run the genetic algorithm
    best_individual = geneticAlgorithm(initial_population, generations, crossover_rate, mutation_rate)
    
    return best_individual

if __name__ == "__main__":
    # Example usage
    mutation_rate = 0.01
    crossover_rate = 0.7
    generations = 1
    population_size = 5
    element_count = 5
    
    best_individual = calculate(mutation_rate, crossover_rate, generations, population_size, element_count)
    print("Best individual:", best_individual.genes, "Fitness:", best_individual.fitness)