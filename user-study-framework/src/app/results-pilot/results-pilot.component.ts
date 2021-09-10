import {Component, ElementRef, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import { SampleDataset } from '../data/SampleDataset';
import { SampleDatasetResult } from '../data/SampleDatasetResult';
import { StudyDates } from '../data/StudyDates';
import * as d3 from 'd3';
declare var require: any;

@Component({
  selector: 'app-results-pilot',
  templateUrl: './results-pilot.component.html',
  styleUrls: ['./results-pilot.component.css']
})

export class ResultsPilotComponent implements AfterViewInit {

  constructor() {
    // Read results
    const rawParticipantsData = require('./results.json');
    // Format results as array
    this.participants = Object.values(rawParticipantsData);
    // Get total number of participants
    this.numParticipants = this.participants.length;
    // Load datasets
    this.datasets = {};
    const datasetSamples = require('../data/studydatasets.json');
    for (const dd of Object.values(datasetSamples)) {
      // @ts-ignore
      this.datasets[dd.seed] = new SampleDataset(dd.seed, dd.distribution, dd.samples, dd.bins);
    }
    // Study variables
    this.wrong = 0;
    this.correct = 0;
    this.errorRate = 0;
    // Error rate
    this.calculateErrorRate();
  }

  // Datasets
  private numDatasets = 160;
  private datasets: { [name: string]: SampleDataset };

  // Participants
  public numParticipants: number;
  private readonly participants: any[];

  // Study variables
  public wrong: number;
  public correct: number;
  public errorRate: number;

  // SVG and parent DIV elements
  @ViewChild('plotresultsparent') divPlotresultsParent: ElementRef;
  @ViewChild('ploterrorbytype') svgPlotTypes: ElementRef;
  @ViewChild('ploterrorperbinsize') svgPlotBinsizes: ElementRef;
  @ViewChild('plotsanitycheckparent') divSanitycheckParent: ElementRef;
  @ViewChild('plotsanitycheck1') svgPlotSanitycheck1: ElementRef;
  @ViewChild('plotsanitycheck2') svgPlotSanitycheck2: ElementRef;
  @ViewChild('plottimeparent') divPlotTimeParent: ElementRef;
  @ViewChild('plottime') svgPlotTime: ElementRef;
  @ViewChild('plotparticipantsparent') divPlotParticipantsParent: ElementRef;
  @ViewChild('plotparticipantsage') svgPlotParticipantsAge: ElementRef;
  @ViewChild('plotparticipantsresidence') svgPlotParticipantsResidence: ElementRef;
  @ViewChild('plotparticipantsexperience') svgPlotParticipantsExperience: ElementRef;
  @ViewChild('plotparticipantseducation') svgPlotParticipantsEducation: ElementRef;
  @ViewChild('plotparticipantsprofession') svgPlotParticipantsProfession: ElementRef;
  @ViewChild('plotdatasetsparent') divPlotDatasetsParent: ElementRef;
  @ViewChild('plotdatasets') svgPlotDatasets: ElementRef;

  // Tooltip
  @ViewChild('tooltip') divTooltip: ElementRef;

  private static deleteSVG(svg: ElementRef): void {
    d3.select(svg.nativeElement).selectAll('*').remove();
  }

  private static formatDatasetName(num: number): string {
    if (num < 10) {
      return '00' + num;
    } else if (num < 100) {
      return '0' + num;
    } else {
      return '' + num;
    }
  }

  private static distributionIsTheSame(d1: string, d2: string): boolean {
    return d1 === d2 || (d1 === 'normal_bimodal' && d2 === 'bimodal');
  }

  ngAfterViewInit(): void {
    this.redraw();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.redraw();
  }

  private redraw(): void {
    this.plotDatasetTypes();
    this.plotBinsizes();
    this.plotSanitycheck1();
    this.plotSanitycheck2();
    this.plotParticipantsTime();
    this.plotParticipantsAge();
    this.plotParticipantsResidence();
    this.plotParticipantsExperience();
    this.plotParticipantsEducation();
    this.plotParticipantsProfession();
    this.plotDatasetDistribution();
  }

  private calculateErrorRate(): void {
    this.wrong = 0;
    this.correct = 0;
    this.participants.forEach((p) => {
      p.data.results.forEach((r) => {
        if (ResultsPilotComponent.distributionIsTheSame(r.answer, this.datasets[r.dataset].distribution)) {
          this.correct += 1;
        } else {
          this.wrong += 1;
        }
      });
    });
    const errorRate = (this.wrong / (this.wrong + this.correct)) * 100.0;
    this.errorRate = Math.round(errorRate * 100) / 100; // Round to two decimals
  }

  private plotDatasetTypes(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 60, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotresultsParent.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotTypes);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotTypes.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build dataset categories and data array
    const groups = ['uniform', 'normal', 'bimodal', 'gamma'];
    const dataPerType = {
      uniform: { name: 'uniform', correct: 0, wrong: 0 },
      normal: { name: 'normal', correct: 0, wrong: 0 },
      bimodal: { name: 'bimodal', correct: 0, wrong: 0 },
      gamma: { name: 'gamma', correct: 0, wrong: 0 }
    };

    // Format data
    this.participants.forEach((p) => {
      p.data.results.forEach((r) => {
        const distr = this.datasets[r.dataset].distribution;
        if (ResultsPilotComponent.distributionIsTheSame(r.answer, distr)) {
          dataPerType[distr].correct += 1;
        } else {
          dataPerType[distr].wrong += 1;
        }
      });
    });

    // X axis
    const x = d3.scaleBand().domain(groups).range([0, plotFormat.width]).padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x).ticks(4))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerType).map((dd) => dd.correct + dd.wrong));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(7));

    // Build stacked categories and color mapping
    const subgroups = ['correct', 'wrong'];
    const color = d3.scaleOrdinal().domain(subgroups).range(['#66c2a5', '#fc8d62']);

    // Create stacked bars
    const stackedData = d3.stack().keys(subgroups)(Object.values(dataPerType));
    canvas.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.name))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
  }

  private plotBinsizes(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 60, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotresultsParent.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotBinsizes);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotBinsizes.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Find all binsizes
    const allBinsizes = [];
    const dataPerBinsize: { [name: string]: SampleDatasetResult } = {};
    for (const dd of Object.values(this.datasets)) {
      dataPerBinsize[dd.bins] = new SampleDatasetResult('' + dd.bins);
      allBinsizes.push(dd.bins);
    }
    const groups = allBinsizes.filter((elem, index, self) => index === self.indexOf(elem));

    // Format data
    this.participants.forEach((p) => {
      p.data.results.forEach((r) => {
        const distr = this.datasets[r.dataset].distribution;
        if (ResultsPilotComponent.distributionIsTheSame(r.answer, distr)) {
          dataPerBinsize[this.datasets[r.dataset].bins].correct += 1;
        } else {
          dataPerBinsize[this.datasets[r.dataset].bins].wrong += 1;
        }
      });
    });

    // X axis
    const x = d3.scaleBand().domain(groups).range([0, plotFormat.width]).padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x));

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerBinsize).map((dd) => dd.correct + dd.wrong));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(7));

    // Build stacked categories and color mapping
    const subgroups = ['correct', 'wrong'];
    const color = d3.scaleOrdinal().domain(subgroups).range(['#66c2a5', '#fc8d62']);

    // Create stacked bars
    const stackedData = d3.stack().keys(subgroups)(Object.values(dataPerBinsize));
    canvas.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.name))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
  }

  private plotSanitycheck1(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 60, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divSanitycheckParent.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotSanitycheck1);
    d3.select(this.svgPlotSanitycheck1.nativeElement).selectAll('*').remove();

    // Create g for drawing
    const canvas = d3.select(this.svgPlotSanitycheck1.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    const dataPerAnswer = {
      samplesize: { name: 'samplesize', count: 0 },
      numbars: { name: 'numbars', count: 0 },
      maxvalue: { name: 'maxvalue', count: 0 },
      statsign: { name: 'statsign', count: 0 },
      dunno: { name: 'dunno', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.sanitycheck.q1].count += 1);
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(7));

    // Draw bars
    canvas.selectAll('.bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotSanitycheck2(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 60, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divSanitycheckParent.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotSanitycheck2);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotSanitycheck2.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    const dataPerAnswer = {
      1000: { name: '1000', count: 0 },
      10000: { name: '10000', count: 0 },
      100000: { name: '100000', count: 0 },
      1000000: { name: '1000000', count: 0 },
      dunno: { name: 'dunno', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.sanitycheck.q2].count += 1);
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y));

    // Draw bars
    canvas.selectAll('.bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsAge(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 50, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotParticipantsParent.nativeElement.clientWidth / 2) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 150 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotParticipantsAge);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotParticipantsAge.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build groups
    const dataPerAnswer = {
      '0-19': { name: '0-19', count: 0 },
      '20-29': { name: '20-29', count: 0 },
      '30-49': { name: '30-49', count: 0 },
      '50-69': { name: '50-69', count: 0 },
      '70+': { name: '70+', count: 0 },
      'n/a': { name: 'n/a', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.participant.age].count += 1);

    // Format data
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    // Draw bars
    canvas.selectAll('bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsResidence(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 50, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotParticipantsParent.nativeElement.clientWidth / 2) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 150 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotParticipantsResidence);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotParticipantsResidence.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build groups
    const dataPerAnswer = {
      Austria: { name: 'Austria', count: 0 },
      EU: { name: 'EU', count: 0 },
      'non-EU': { name: 'non-EU', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.participant.residence].count += 1);

    // Format data
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    // Draw bars
    canvas.selectAll('bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsExperience(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 70, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotParticipantsParent.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 150 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotParticipantsExperience);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotParticipantsExperience.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build groups
    const dataPerAnswer = {
      none: { name: 'none', count: 0 },
      media: { name: 'media', count: 0 },
      experienced: { name: 'experienced', count: 0 },
      expert: { name: 'expert', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.participant.experience].count += 1);

    // Format data
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    // Draw bars
    canvas.selectAll('bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsEducation(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 70, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotParticipantsParent.nativeElement.clientWidth / 2) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 150 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotParticipantsEducation);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotParticipantsEducation.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build groups
    const dataPerAnswer = {
      'high-school': { name: 'high-school', count: 0 },
      bachelor: { name: 'bachelor', count: 0 },
      master: { name: 'master', count: 0 },
      phd: { name: 'phd', count: 0 },
      'trade-school': { name: 'trade-school', count: 0 },
      'n/a': { name: 'n/a', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.participant.education].count += 1);

    // Format data
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    canvas.selectAll('bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsProfession(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 70, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotParticipantsParent.nativeElement.clientWidth / 2) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 150 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotParticipantsProfession);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotParticipantsProfession.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build groups
    const dataPerAnswer = {
      student: { name: 'student', count: 0 },
      'research-edu': { name: 'research-edu', count: 0 },
      'full-time': { name: 'full-time', count: 0 },
      'part-time': { name: 'part-time', count: 0 },
      retired: { name: 'retired', count: 0 },
      'n/a': { name: 'n/a', count: 0 }
    };

    // Format data
    this.participants.forEach((p) => dataPerAnswer[p.data.participant.profession].count += 1);

    // Format data
    const plotData = Object.values(dataPerAnswer);

    // X axis
    const x = d3.scaleBand()
      .domain(plotData.map((d) => d.name))
      .range([0, plotFormat.width])
      .padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerAnswer).map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    canvas.selectAll('bar')
      .data(plotData)
      .enter().append('rect')
      .style('fill', 'steelblue')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => plotFormat.height - y(d.count));
  }

  private plotParticipantsTime(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 70, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotTimeParent.nativeElement.clientWidth - 100) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    ResultsPilotComponent.deleteSVG(this.svgPlotTime);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotTime.nativeElement)
      .append('g')
      .attr('transform',
        'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Get min/max dates
    const minDate = new Date('November 11, 2020 00:00:00');
    const maxDate = new Date();
    const daysInBetween = (new StudyDates()).getDates(minDate, maxDate);

    // Format days
    const countsPerDay = [];
    daysInBetween.forEach((d) => countsPerDay.push({ day: d, count: 0 }));

    // Format data
    this.participants.forEach((p) => {
      for (let i = 0; i < daysInBetween.length; i++) {
        if (p.data.timestamp >= daysInBetween[i].getTime() && p.data.timestamp < daysInBetween[i + 1].getTime()) {
          countsPerDay[i].count += 1;
          break;
        }
      }
    });

    // X axis
    const x = d3.scaleTime()
      .domain(d3.extent(countsPerDay, (d) => d.day))
      .range([0, plotFormat.width]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x).ticks(countsPerDay.length).tickFormat(d3.timeFormat('%B %d')))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    // Y axis
    const maxValue = Math.max.apply(Math, countsPerDay.map((dd) => dd.count));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y).ticks(3));

    // Draw line
    const line = d3.line()
      .x((d) => x(d.day))
      .y((d) => y(d.count))
      .curve(d3.curveLinear);
    canvas.append('path')
      .datum(countsPerDay)
      .style('stroke', 'steelblue')
      .style('fill', 'none')
      .attr('d', line);
  }

  private plotDatasetDistribution(): void {
    const plotFormat = {
      margin: { top: 10, right: 30, bottom: 40, left: 30 },
      width: 0,
      height: 0
    };
    plotFormat.width = (this.divPlotDatasetsParent.nativeElement.clientWidth - 100) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 400 - plotFormat.margin.bottom - plotFormat.margin.left;
    ResultsPilotComponent.deleteSVG(this.svgPlotDatasets);

    // Create g for drawing
    const canvas = d3.select(this.svgPlotDatasets.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Build dataset categories and data array
    const groups = [];
    const dataPerDataset: { [name: string]: SampleDatasetResult } = {};
    for (let i = 0; i < this.numDatasets; i++) {
      const datasetid = ResultsPilotComponent.formatDatasetName(i);
      groups.push(datasetid);
      dataPerDataset[datasetid] = new SampleDatasetResult(datasetid);
    }

    // Format data
    this.participants.forEach((p) => {
      p.data.results.forEach((r) => {
        const datasetid = ResultsPilotComponent.formatDatasetName(r.dataset);
        if (ResultsPilotComponent.distributionIsTheSame(r.answer, this.datasets[r.dataset].distribution)) {
          dataPerDataset[datasetid].correct += 1;
        } else {
          dataPerDataset[datasetid].wrong += 1;
        }
      });
    });

    // X axis
    const x = d3.scaleBand().domain(groups).range([0, plotFormat.width]).padding([0.2]);
    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x).ticks(160))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-90)');

    // Y axis
    const maxValue = Math.max.apply(Math, Object.values(dataPerDataset).map((dd) => dd.correct + dd.wrong));
    const y = d3.scaleLinear().domain([0, maxValue]).range([plotFormat.height, 0 ]);
    canvas.append('g').call(d3.axisLeft(y));

    // Build stacked categories and color mapping
    const subgroups = ['correct', 'wrong'];
    const color = d3.scaleOrdinal().domain(subgroups).range(['#66c2a5', '#fc8d62']);

    // Build stacked data
    const stackedData = d3.stack().keys(subgroups)(Object.values(dataPerDataset));

    // Draw stacked bar chart
    canvas.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.name))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mousemove', (event, d) => {
        d3.select(event.target).style('stroke', 'DarkSlateGray');
        d3.select(this.divTooltip.nativeElement)
          .style('display', 'inline-block')
          .style('left', event.pageX - 170 + 'px')
          .style('top', event.pageY - 30 + 'px')
          .html(d.data.name + ' (' + d.data.correct + ' correct, ' + d.data.wrong + ' wrong)');
      })
      .on('mouseout', (event) => {
        d3.select(event.target).style('stroke', 'none');
        d3.select(this.divTooltip.nativeElement).style('display', 'none');
      });
  }

}
