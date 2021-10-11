import csv
import numpy as np
from multiprocessing import Pool
from scipy.stats import kurtosis
from scipy.stats import skew

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
    proportion = g.uniform(0.3, 0.7)
    sample1 = normal(int(n*proportion), seed, loc, scale)
    sample2 = normal(n-int(n*proportion), seed+100000, loc2, scale2)
    s = np.concatenate((sample1, sample2))
    return s

def bin_normal_moments(params):
    actual_bins = params[2]
    n = params[0]
    seed = params[1]
    distribution = normal(n, seed)
    am = np.mean(distribution)
    av = np.var(distribution)
    ac = skew(distribution)
    ak = kurtosis(distribution)
    o = {
        'samples': n,
        'seed': seed,
        'loc': 0.0,
        'scale': 1.0,
        'actual_moments': {
            'actual_mean': am,
            'actual_variance': av,
            'actual_skew': ac,
            'actual_kurtosis': ak,
            'range': abs(np.min(distribution)) + abs(np.max(distribution))
        },
        'moments': []
    }
    for b in actual_bins:
        n, bins = np.histogram(distribution, bins=b)
        sample = np.array([])
        for i,e in enumerate(n):
            if e != 0:
                mean = (bins[i] + bins[i+1])/2
                sample = np.concatenate((sample, np.repeat(mean, e)))
        m = np.mean(sample)
        v = np.var(sample)
        s = skew(sample)
        k = kurtosis(sample)
        o['moments'].append({
            'bins': b,
            'mean': m,
            'variance': v,
            'skew': s,
            'kurtosis': k
        })
    return o

def bin_uniform_moments(params):
    actual_bins = params[2]
    n = params[0]
    seed = params[1]
    distribution = uniform(n, seed)
    am = np.mean(distribution)
    av = np.var(distribution)
    ac = skew(distribution)
    ak = kurtosis(distribution)
    o = {
        'samples': n,
        'seed': seed,
        'min': 1,
        'max': 10000,
        'actual_moments': {
            'actual_mean': am,
            'actual_variance': av,
            'actual_skew': ac,
            'actual_kurtosis': ak,
            'range': abs(np.min(distribution)) + abs(np.max(distribution))
        },
        'moments': []
    }
    for b in actual_bins:
        n, bins = np.histogram(distribution, bins=b)
        sample = np.array([])
        for i,e in enumerate(n):
            if e != 0:
                mean = (bins[i] + bins[i+1])/2
                sample = np.concatenate((sample, np.repeat(mean, e)))
        m = np.mean(sample)
        v = np.var(sample)
        s = skew(sample)
        k = kurtosis(sample)
        o['moments'].append({
            'bins': b,
            'mean': m,
            'variance': v,
            'skew': s,
            'kurtosis': k
        })
    return o

def bin_gamma_moments(params):
    actual_bins = params[2]
    n = params[0]
    seed = params[1]
    distribution = gamma(n, seed)
    am = np.mean(distribution)
    av = np.var(distribution)
    ac = skew(distribution)
    ak = kurtosis(distribution)
    o = {
        'samples': n,
        'seed': seed,
        'shape': 2.0,
        'scale': 2.0,
        'actual_moments': {
            'actual_mean': am,
            'actual_variance': av,
            'actual_skew': ac,
            'actual_kurtosis': ak,
            'range': abs(np.min(distribution)) + abs(np.max(distribution))
        },
        'moments': []
    }
    for b in actual_bins:
        n, bins = np.histogram(distribution, bins=b)
        sample = np.array([])
        for i,e in enumerate(n):
            if e != 0:
                mean = (bins[i] + bins[i+1])/2
                sample = np.concatenate((sample, np.repeat(mean, e)))
        m = np.mean(sample)
        v = np.var(sample)
        s = skew(sample)
        k = kurtosis(sample)
        o['moments'].append({
            'bins': b,
            'mean': m,
            'variance': v,
            'skew': s,
            'kurtosis': k
        })
    return o

def bin_bimodal_moments(params):
    actual_bins = params[2]
    n = params[0]
    seed = params[1]
    distribution = bimodal(n, seed, 1.5, 2.0)
    am = np.mean(distribution)
    av = np.var(distribution)
    ac = skew(distribution)
    ak = kurtosis(distribution)
    o = {
        'samples': n,
        'seed': seed,
        'min': 1.5,
        'max': 2.0,
        'actual_moments': {
            'actual_mean': am,
            'actual_variance': av,
            'actual_skew': ac,
            'actual_kurtosis': ak,
            'range': abs(np.min(distribution)) + abs(np.max(distribution))
        },
        'moments': []
    }
    for b in actual_bins:
        n, bins = np.histogram(distribution, bins=b)
        sample = np.array([])
        for i,e in enumerate(n):
            if e != 0:
                mean = (bins[i] + bins[i+1])/2
                sample = np.concatenate((sample, np.repeat(mean, e)))
        m = np.mean(sample)
        v = np.var(sample)
        s = skew(sample)
        k = kurtosis(sample)
        o['moments'].append({
            'bins': b,
            'mean': m,
            'variance': v,
            'skew': s,
            'kurtosis': k
        })
    return o

def convert_bin_moments_to_errors(m, dist):
    d = {}
    am = {}
    for el in m:
        if el['scale'] not in d:
            d[el['scale']] = {}
            am[el['scale']] = {}
        if el['loc'] not in d[el['scale']]:
            d[el['scale']][el['loc']] = {}
            am[el['scale']][el['loc']] = {}
        if el['samples'] not in d[el['scale']][el['loc']]:
            d[el['scale']][el['loc']][el['samples']] = {}
            am[el['scale']][el['loc']][el['samples']] =  el['actual_moments']
        inp = d[el['scale']][el['loc']][el['samples']]
        for mom in el['moments']:
            if mom['bins'] not in inp:
                inp[mom['bins']] = {
                    'mean': [],
                    'variance': [],
                    'skew': [],
                    'kurtosis': []
                }
            a = inp[mom['bins']]
            a['mean'].append(mom['mean'])
            a['variance'].append(mom['variance'])
            a['skew'].append(mom['skew'])
            a['kurtosis'].append(mom['kurtosis'])
    errors = []
    for scale in d:
        for loc in d[scale]:
            for samples in d[scale][loc]:
                actual_mean = am[scale][loc][samples]['actual_mean']
                actual_variance = am[scale][loc][samples]['actual_variance']
                actual_skew = am[scale][loc][samples]['actual_skew']
                actual_kurtosis = am[scale][loc][samples]['actual_kurtosis']
                range = am[scale][loc][samples]['range']
                for bins in d[scale][loc][samples]:
                    draws = len(d[scale][loc][samples][bins]['mean'])
                    bin_mean = np.mean(d[scale][loc][samples][bins]['mean'])
                    bin_variance = np.mean(d[scale][loc][samples][bins]['variance'])
                    bin_skew = np.mean(d[scale][loc][samples][bins]['skew'])
                    bin_kurtosis = np.mean(d[scale][loc][samples][bins]['kurtosis'])
                    e = {
                        'distribution': dist,
                        'samples': samples,
                        'draws': draws,
                        'bins': bins,
                        'location': loc,
                        'scale': scale,
                        'range': range,
                        'actual_mean': actual_mean,
                        'actual_variance': actual_variance,
                        'actual_skew': actual_skew,
                        'actual_kurtosis': actual_kurtosis,
                        'bin_mean': bin_mean,
                        'bin_variance': bin_variance,
                        'bin_skew': bin_skew,
                        'bin_kurtosis': bin_kurtosis
                    }
                    errors.append(e)
    return errors

def convert_x_bin_moments_to_errors(m, dist):
    d = {}
    am = {}
    for el in m:
        if el['samples'] not in d:
            d[el['samples']] = {}
            am[el['samples']] =  {
                'actual_mean': [],
                'actual_variance': [],
                'actual_skew': [],
                'actual_kurtosis': [],
                'range': []
            }
        am[el['samples']]['actual_mean'].append(el['actual_moments']['actual_mean'])
        am[el['samples']]['actual_variance'].append(el['actual_moments']['actual_variance'])
        am[el['samples']]['actual_skew'].append(el['actual_moments']['actual_skew'])
        am[el['samples']]['actual_kurtosis'].append(el['actual_moments']['actual_kurtosis'])
        am[el['samples']]['range'].append(el['actual_moments']['range'])
        inp = d[el['samples']]
        for mom in el['moments']:
            if mom['bins'] not in inp:
                inp[mom['bins']] = {
                    'mean': [],
                    'variance': [],
                    'skew': [],
                    'kurtosis': []
                }
            a = inp[mom['bins']]
            a['mean'].append(mom['mean'])
            a['variance'].append(mom['variance'])
            a['skew'].append(mom['skew'])
            a['kurtosis'].append(mom['kurtosis'])
    errors = []
    for samples in d:
        actual_mean = np.mean(am[samples]['actual_mean'])
        actual_variance = np.mean(am[samples]['actual_variance'])
        actual_skew = np.mean(am[samples]['actual_skew'])
        actual_kurtosis = np.mean(am[samples]['actual_kurtosis'])
        range = np.mean(am[samples]['range'])
        for bins in d[samples]:
            draws = len(d[samples][bins]['mean'])
            bin_mean = np.mean(d[samples][bins]['mean'])
            bin_variance = np.mean(d[samples][bins]['variance'])
            bin_skew = np.mean(d[samples][bins]['skew'])
            bin_kurtosis = np.mean(d[samples][bins]['kurtosis'])
            e = {
                'distribution': dist,
                'samples': samples,
                'draws': draws,
                'bins': bins,
                'range': range,
                'actual_mean': actual_mean,
                'actual_variance': actual_variance,
                'actual_skew': actual_skew,
                'actual_kurtosis': actual_kurtosis,
                'bin_mean': bin_mean,
                'bin_variance': bin_variance,
                'bin_skew': bin_skew,
                'bin_kurtosis': bin_kurtosis
            }
            errors.append(e)
    return errors


def write_errors(er, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer_p = csv.writer(csvfile, delimiter=';', quoting=csv.QUOTE_NONE)
        writer_p.writerow([
            'distribution',
            'samples',
            'draws',
            'bins',
            'range',
            'actual mean',
            'actual variance',
            'actual skew',
            'actual kurtosis',
            'bin mean',
            'bin variance',
            'bin skew',
            'bin kurtosis',
            'difference mean',
            'difference variance',
            'difference skew',
            'difference kurtosis',
            'error mean',
            'error variance',
            'error skew',
            'error kurtosis'
        ])
        for e in er:
            writer_p.writerow([
                e['distribution'],
                e['samples'],
                e['draws'],
                e['bins'],
                e['range'],
                e['actual_mean'],
                e['actual_variance'],
                e['actual_skew'],
                e['actual_kurtosis'],
                e['bin_mean'],
                e['bin_variance'],
                e['bin_skew'],
                e['bin_kurtosis'],
                e['actual_mean'] - e['bin_mean'],
                e['actual_variance'] - e['bin_variance'],
                e['actual_skew'] - e['bin_skew'],
                e['actual_kurtosis'] - e['bin_kurtosis'],
                abs(e['actual_mean'] - e['bin_mean'])/e['range'],
                abs(pow(e['actual_variance'],(1/2.0)) - pow(e['bin_variance'],(1/2.0)))/e['range'],
                abs(pow(abs(e['actual_skew']),(1/3.0)) - pow(abs(e['bin_skew']),(1/3.0)))/e['range'],
                abs(pow(e['actual_kurtosis']+3.0,(1/4.0)) - pow(e['bin_kurtosis']+3.0,(1/4.0)))/e['range']
            ])

def generate_variants(samples, seeds, bins):
    o = []
    for sample in samples:
        for seed in seeds:
            o.append((sample, seed, bins))
    return o

samples = [100,10000,100000]
draws = 1000
seeds = list(range(0,draws))
bins = list(range(2,50))
#bins = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
variants = generate_variants(samples, seeds, bins)
norm = []
unif = []
gam = []
bimod = []

if __name__ == '__main__':
    with Pool(20) as p:
         norm = p.map(bin_normal_moments, variants)
         unif = p.map(bin_uniform_moments, variants)
         gam = p.map(bin_gamma_moments, variants)
         bimod = p.map(bin_bimodal_moments, variants)


er = convert_x_bin_moments_to_errors(norm, "normal")
er2 = convert_x_bin_moments_to_errors(unif, "uniform")
er3 = convert_x_bin_moments_to_errors(gam, "gamma")
er4 = convert_x_bin_moments_to_errors(bimod, "bimodal")

era = er + er2 + er3 + er4

write_errors(era, 'moments_mean.csv')
