def fitness_function(x):
    """
    Evaluates the fitness of an individual.
    
    Args:
        individual (list): The individual to evaluate.
    
    Returns:
        float: The fitness score of the individual.
    """
    x_linf, x_lsup = -3, 5  # Assuming genes are within these limits
    x = [xi if x_linf <= xi <= x_lsup else (x_linf if xi < x_linf else x_lsup) for xi in x]
    x1, x2 = x
    
    rp = 20
    return (x1-1)**2 + (x2-1)**2 + rp * ( max(0,x1+x2-0.5)**2 + (x1-x2-2)**2 )

if __name__ == "__main__":
    # Example usage
    x = [1.2495371577935344, -0.7145299529921595]   # Solution here - Best fitness = 3.0522152911328324
    #x = [1.25, -0.75]
    x1, x2 = x
    fitness = fitness_function(x)
    print("Punição 1:", max(0,x1+x2-0.5)**2)
    print("Punição 2:", (x1-x2-2)**2)
    print(f"Fitness of {x}: {fitness}")