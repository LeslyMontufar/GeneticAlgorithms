def fitness_function(x):
    """
    Evaluates the fitness of an individual.
    
    Args:
        individual (list): The individual to evaluate.
    
    Returns:
        float: The fitness score of the individual.
    """
    return Rastrigin(x,-5.12,5.12) 
    # return Rosenbrock(x, -1, 2) 

from math import cos, pi

def Rosenbrock(x, x_linf=-1, x_lsup=2):
    """
    Rosenbrock function for optimization.
    
    Args:
        x_lsup (float): Upper limit for the variables.
        x_linf (float): Lower limit for the variables.
        n (int): Number of variables.
    
    Returns:
        float: The value of the Rosenbrock function.
    """
    n = len(x)  # Ensure n is the length of x
    x = [xi if x_linf <= xi <= x_lsup else (x_linf if xi < x_linf else x_lsup) for xi in x]  # Clamping values to limits
    return sum([100 * (x[i+1] - x[i]**2)**2 + (1 - x[i])**2 for i in range(n-1)])  # Assuming xi are the variables

def Rastrigin(x, x_linf=-5.12, x_lsup=5.12):
    """
    Rastrigin function for optimization.
    
    Args:
        x_lsup (float): Upper limit for the variables.
        x_linf (float): Lower limit for the variables.
    
    Returns:
        float: The value of the Rastrigin function.
    """
    n = len(x) 
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