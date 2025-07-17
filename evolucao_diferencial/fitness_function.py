def fitness_function(x):
    """
    Evaluates the fitness of an individual.
    
    Args:
        individual (list): The individual to evaluate.
    
    Returns:
        float: The fitness score of the individual.
    """
    return Rastrigin(x,-5.12,5.12, 2)  # Assuming genes are integers or floats

from math import cos, pi

def Rastrigin(x, x_linf, x_lsup, n):
    """
    Rastrigin function for optimization.
    
    Args:
        x_lsup (float): Upper limit for the variables.
        x_linf (float): Lower limit for the variables.
        n (int): Number of variables.
    
    Returns:
        float: The value of the Rastrigin function.
    """
    
    x = [xi if x_linf <= xi <= x_lsup else (x_linf if xi < x_linf else x_lsup) for xi in x]  # Clamping values to limits
    A = 10
    return A * n + sum([(xi**2 - A * cos(2 * pi * xi)) for xi in x])  # Assuming xi are the variables

if __name__ == "__main__":
    # Example usage
    x = [0, 0]  # Example individual
    fitness = fitness_function(x)
    print(f"Fitness of {x}: {fitness}")
    
    # Test Rastrigin function
    result = Rastrigin(x, -5.12, 5.12, len(x))
    print(f"Rastrigin function result for {x}: {result}")