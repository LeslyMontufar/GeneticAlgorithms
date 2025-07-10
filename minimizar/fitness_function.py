def fitness_function(individual):
    """
    Evaluates the fitness of an individual.
    
    Args:
        individual (list): The individual to evaluate.
    
    Returns:
        float: The fitness score of the individual.
    """
    # Example fitness function: sum of the individual's genes
    return Rastrigin(-5.12,5.12, 2)  # Assuming genes are integers or floats

from math import cos, pi

def Rastrigin(x_lsup, x_linf, n):
    """
    Rastrigin function for optimization.
    
    Args:
        x_lsup (float): Upper limit for the variables.
        x_linf (float): Lower limit for the variables.
        n (int): Number of variables.
    
    Returns:
        float: The value of the Rastrigin function.
    """
    A = 10
    return A * n + sum([(xi**2 - A * cos(2 * pi * xi)) for xi in range(n)])  # Assuming xi are the variables