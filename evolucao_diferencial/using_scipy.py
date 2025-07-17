import numpy as np
from scipy.optimize import rosen, differential_evolution
bounds = [(-1,2), (-1, 2)]
result = differential_evolution(rosen, bounds)
print(result.x, result.fun)
# (array([1., 1., 1., 1., 1.]), 1.9216496320061384e-1