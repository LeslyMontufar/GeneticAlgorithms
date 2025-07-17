import random
import numpy as np
from fitness_function import *

MAXIMIZAR = False
LINF, LSUP = -5.12, 5.12

class Individual:
    def __init__(self, genes):
        self.genes = genes
        self.fitness = 0
        self.evaluate_fitness()

    def evaluate_fitness(self):
        self.fitness = fitness_function(self.genes)

def diferential_evolution(generations, population_size, element_count, crossover_rate, mutation_factor):
    population = [Individual(np.random.uniform(LINF, LSUP, size=element_count)) for _ in range(population_size)]
    next_population = [] 
    best_individual = None
    elitism_num = 5
    min_mutation_factor = 0.1
    aexp = (min_mutation_factor/(np.exp(-generations)))

    for generation in range(generations):
        next_population = []
        for i in range(0,population_size):
            a, b, c = [np.array(population[idx].genes) for idx in random.sample(
                [idx for idx in range(population_size) if idx != i], 3)]

            # Mutação
            mutation_factor = aexp* np.exp(-generation) + mutation_factor
            mutant = np.clip(a + mutation_factor * (b - c), LINF, LSUP)
            print("\t\ta:", a, "b:", b, "c:", c, "mutant:", mutant)

            # Crossover
            cross_points = np.random.rand(element_count) < crossover_rate
            if not np.any(cross_points): # Force at least one crossover point
                cross_points[np.random.randint(0, element_count)] = True
            trial = Individual(np.where(cross_points, mutant, population[i].genes))            

            # Seleção 
            if (trial.fitness > population[i].fitness) ^ MAXIMIZAR: # XOR
                next_population.append(trial)
                if i<elitism_num:
                    next_population.append(population[i])  # Elitism: keep the best individuals
            else:
                next_population.append(population[i])
                 
        population = next_population[:population_size]  # Ensure population size remains constant
        population.sort(key=lambda ind: ind.fitness, reverse=MAXIMIZAR)  # Sort population by fitness
        best_individual = population[0]  # Best individual is the first one after sorting
        print(f"Generation {generation+1}: Best individual: {best_individual.genes}  Best fitness = {best_individual.fitness} Worst fitness = {population[-1].fitness}")      
    
    return best_individual

if __name__ == "__main__":
    mutation_factor = 0.5
    crossover_rate = 0.7
    generations = 100
    population_size = 10
    element_count = 2 # x y of the Rastrigin function
    best_individual = diferential_evolution(generations, population_size, element_count, crossover_rate, mutation_factor)
    print("Best individual:", best_individual.genes, "Fitness:", best_individual.fitness)