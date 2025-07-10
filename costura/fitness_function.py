def fitness_function(individual):
    """
    Evaluates the fitness of an individual.
    
    Args:
        individual (list): The individual to evaluate.
    
    Returns:
        float: The fitness score of the individual.
    """
    # Example fitness function: sum of the individual's genes
    return sum(individual)  # Assuming genes are integers or floats