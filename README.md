## Histogram binning revisited

We implemented a quantitative user study to evaluate how well users can visually perceive the underlying data distribution from a histogram representation. We used histograms with different sample and bin sizes and four different distributions (uniform, normal, bimodal, and gamma). The study results confirm that, in general, more bins correlate with fewer errors by the viewers.

![Teaser](https://raw.githubusercontent.com/johanna-schmidt/histogram-binning-revisited/main/pics/teaser.png)

However, upon a certain number of bins, the error rate cannot be improved by adding more bins. By comparing our study results with the outcomes of existing mathematical models for histogram binning (e.g., Sturges’ formula, Scott’s normal reference rule, the Rice Rule, or Freedman–Diaconis’ choice), we can see that most of them overestimate the number of bins necessary to make the distribution visible to a human viewer.

## Reference

This work originated from a joint research project between the VRVis Research Center and the University of Vienna in Austria.

Please cite the following paper when using any material provided here:

> Raphael Sahann, Torsten Moeller, and Johanna Schmidt (2021).
> *Histogram binning revisited with a focus on human perception*.
> In Proceedings of VIS: Short Papers.

http://ieeevis.org/year/2021/info/papers-sessions

## Content

This repository contains additional material from the research associated with this short paper. This includes:
* Short **paper** (PDF)
* **Python code** that was used to generate the moments of the distributions
* **Angular framework** that was used to conduct the user study
* User study **results** (CSV files)
