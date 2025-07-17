import numpy as np

from fitness_function import Rastrigin as rastrigin

# def rastrigin(x):
#     A = 10
#     return A * len(x) + sum(xi**2 - A * np.cos(2 * np.pi * xi) for xi in x)

def differential_evolution(fitness_fn, bounds, pop_size=15, mutation=(0.5, 1), crossover=0.9,
                           generations=1000, tol=1e-6, seed=None):
    # np.random.seed(seed)

    dim = len(bounds)
    lower = np.array([b[0] for b in bounds])
    upper = np.array([b[1] for b in bounds])
    diff = upper - lower

    # Inicialização
    pop = lower + diff * np.random.rand(pop_size, dim)
    fitness = np.array([fitness_fn(ind) for ind in pop])
    best_idx = np.argmin(fitness)
    best = pop[best_idx]
    best_fit = fitness[best_idx]

    for gen in range(generations):
        for i in range(pop_size):
            # Seleciona 3 indivíduos distintos e diferentes de i
            idxs = [idx for idx in range(pop_size) if idx != i]
            a, b, c = pop[np.random.choice(idxs, 3, replace=False)]

            # F adaptativo
            F = mutation # F = np.random.uniform(*mutation)

            # Mutação
            mutant = np.clip(a + F * (b - c), lower, upper)

            # Crossover binomial
            cross_points = np.random.rand(dim) < crossover
            if not np.any(cross_points):
                cross_points[np.random.randint(0, dim)] = True
            trial = np.where(cross_points, mutant, pop[i])

            # Avaliação
            f = fitness_fn(trial)
            if f < fitness[i]:
                pop[i] = trial
                fitness[i] = f
                if f < best_fit:
                    best_fit = f
                    best = trial

        # Critério de parada por tolerância
        # if np.std(fitness) < tol:
        #     break

    print(f"Geração {gen+1}: Melhor fitness = {best_fit}")
    return best, best_fit

if __name__ == "__main__":
    bounds = [(-5.12, 5.12)] * 2
    best_x, best_f = differential_evolution(rastrigin, bounds, pop_size=50, generations=100, seed=42)
    print("Melhor solução:", best_x)
    print("Fitness:", best_f)