import numpy as np

def uniform(n, seed, min = 0, max = 10000):
    return np.random.default_rng(seed).integers(min, max, n)

def normal(n, seed, loc = 0.0, scale = 1.0):
    return np.random.default_rng(seed).normal(loc, scale, n)

def gamma(n, seed, shape = 2.0, scale = 2.0):
    return np.random.default_rng(seed).gamma(shape, scale, n)

def bimodal(n, seed, min, max, loc = 0.0, scale = 1.0):
    g = np.random.default_rng(seed)
    scale2 = g.uniform(0.5, 1.0)
    loc2 = g.uniform(min*(scale+scale2), max*(scale+scale2))
    if g.random() > 0.5:
        loc2 = loc2*-1
    proportion = g.uniform(0.3, 0.7)
    sample1 = normal(int(n*proportion), seed, loc, scale)
    sample2 = normal(n-int(n*proportion), seed+100000, loc2, scale2)
    s = np.concatenate((sample1, sample2))
    return s

def generate_bin_data(distribution, samples, bins, seed):
    sample = None
    if distribution == 'normal':
        sample = normal(samples, seed)
    elif distribution == 'uniform':
        sample = uniform(samples, seed)
    elif distribution == 'gamma':
        sample = gamma(samples, seed)
    elif distribution == 'bimodal':
        sample = bimodal(samples, seed, 1.5, 2.0)
    else:
        return None
    n, bins = np.histogram(sample, bins=bins)
    return n

def generate_user_study_data():
    bins = [2,3,4,5,7,10,15,20,40,100]
    samples = [100, 1000, 10000, 1000000]
    distributions = ['normal', 'uniform', 'gamma', 'bimodal']

    id = 0
    out = {}

    for distribution in distributions:
        for sample in samples:
            for bin in bins:
                data = generate_bin_data(distribution, sample, bin, id)
                entry = {
                    "seed": id,
                    "distribution": distribution,
                    "samples": sample,
                    "bins": bin,
                    "data": data.tolist()
                }
                out[id] = entry
                id = id + 1

    return out

data = generate_user_study_data()


import json
json.dumps(data)
