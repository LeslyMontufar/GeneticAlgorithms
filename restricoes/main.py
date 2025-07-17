import random
from fitness_function import *

LINF, LSUP = -3, 5  # Lower and upper bounds for the genes

class Individual:
    def __init__(self, genes):
        self.genes = genes
        # self.elements = [] # In this application, elements are not used
        self.fitness = 0

    def evaluate_fitness(self, fitness_function):
        self.fitness = fitness_function(self.genes)

def crossover(parents):
    # Radcliffe's crossover method
    beta = random.random()
    parent1, parent2 = parents
    child1_genes = [beta*parent1.genes[i] + (1-beta)*parent2.genes[i] for i in range(len(parent1.genes))]
    child2_genes = [(1-beta)*parent1.genes[i] + beta*parent2.genes[i] for i in range(len(parent1.genes))]
    return Individual(child1_genes), Individual(child2_genes)
    
def select_parents(population, num_parents, elitism_num=3):
    # Tournament selection
    tournament_size = 3
    selected_parents = []
    for _ in range(num_parents):  # Select two parents
        # gera um torneio de 3 individuos (indices)
        tournament_index = random.sample(range(elitism_num,len(population)), tournament_size)
        tournament_index.sort(key=lambda i: population[i].fitness, reverse=False)
        best_individual = population.pop(tournament_index[0])  # Select the best individual from the tournament
        selected_parents.append(best_individual)
    return selected_parents 

def geneticAlgorithm(population: list[Individual], generations, crossover_rate, mutation_rate):
    # Evaluate fitness
    for individual in population:
        individual.evaluate_fitness(fitness_function)
    
    for generation in range(generations):

        for _ in range(len(population)//2):
            
            if random.random() < crossover_rate:
                # Select parents: roulette wheel or tournament selection
                parents = select_parents(population, 2)
                childs = crossover(parents)
                # Evaluate fitness
                for individual in childs:
                    individual.evaluate_fitness(fitness_function)
                population.extend(childs)
                
            if random.random() < mutation_rate:
                # Mutation: Randomly change one gene
                parent, = select_parents(population, 1)
                # Choose a random gene to mutate
                mutation_index = random.randint(0, len(parent.genes) - 1)
                mutation_value = random.uniform(LINF, LSUP)
                parent.genes[mutation_index] = mutation_value
                parent.evaluate_fitness(fitness_function)
                population.append(parent)  # Add mutated individual back to population  
        population.sort(key=lambda ind: ind.fitness, reverse=False)  # Sort population by fitness
        best_individual = population[0]  # Best individual is the first one after sorting
        print(f"Generation {generation+1}: Best individual: {best_individual.genes}  Best fitness = {best_individual.fitness}")      
    
    # best_individual = max(population, key=lambda ind: ind.fitness)
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
    initial_population = [Individual([random.uniform(LINF, LSUP) for _ in range(element_count)]) for _ in range(population_size)]
    
    # Run the genetic algorithm
    best_individual = geneticAlgorithm(initial_population, generations, crossover_rate, mutation_rate)
    
    return best_individual

if __name__ == "__main__":
    # Example usage
    mutation_rate = 0.8
    crossover_rate = 0.9
    generations = 1000
    population_size = 500
    element_count = 2 
    best_individual = calculate(mutation_rate, crossover_rate, generations, population_size, element_count)
    print("Best individual:", best_individual.genes, "Fitness:", best_individual.fitness)