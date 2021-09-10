import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Dataset } from './dataset';
import { RadioGroup } from './radio';
import { ParticipantService } from '../service/participant.service';
import * as d3 from 'd3';

declare var require: any;

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})

/**
 * This class holds all functions needed to conduct the user study.
 * @class
 * @classdesc StudyComponent represents the user study.
 */
export class StudyComponent implements OnInit, AfterViewInit {

  /**
   * Creates a new study.
   * @constructor
   * @param {ParticipantService} participant - The participant service that stores all data of the user study.
   */
  constructor(private participant: ParticipantService) {
    this.numQuestion = 1;
    this.totalNumQuestion = 4;
    this.isNext = true;
    this.isLast = false;
    this.distribution = new RadioGroup();
    this.confidence = new RadioGroup();
    this.errorOccured = false;
    this.plotMargin = { top: 10, right: 30, bottom: 10, left: 10 };
    this.plotWidth = this.svgWidth - this.plotMargin.left - this.plotMargin.right;
    this.plotHeight = this.svgHeight - this.plotMargin.top - this.plotMargin.bottom;
  }

  // Static variables
  public numDatasets = 160;
  public maxQuestions = 20;
  private svgWidth = 500;
  private svgHeight = 350;

  // Current questions
  public totalNumQuestion: number;
  private numQuestion: number;


  // Submit button functionality
  public isNext: boolean;
  public isLast: boolean;

  // Form values
  public distribution: RadioGroup;
  public confidence: RadioGroup;
  public errorOccured: boolean;
  private currentTimeStart: number;

  // SVG element
  @ViewChild('plot') svgplot: ElementRef;

  // Plot parameters
  private plotWidth: number;
  private plotHeight: number;
  private plotMargin: any;

  // Data samples
  private datasetSample: Dataset[];
  public currentSampleSize: number;

  private static getRandominInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /** Generate data samples for user study. */
  ngOnInit(): void {
    const studydatasets = require('../data/studydatasets.json');
    const randomDatasetIds = this.getRandomDatasetArray(this.maxQuestions);
    this.datasetSample = [];
    for (const useId of randomDatasetIds) {
      const dataset = new Dataset();
      dataset.id = useId;
      dataset.sampleSize = studydatasets[useId].samples;
      dataset.numBins = studydatasets[useId].bins;
      dataset.bins = studydatasets[useId].data;
      this.datasetSample.push(dataset);
    }
    this.currentSampleSize = this.datasetSample[0].sampleSize;
  }

  /** Shows first data sample. */
  ngAfterViewInit(): void {
    this.drawHistogram(this.datasetSample[0]);
    this.currentSampleSize = this.datasetSample[0].sampleSize;
    this.currentTimeStart = new Date().getTime();
  }

  /** When user clicks next, show next data sample. */
  public onNextBtnClicked(): void {
    if (this.distribution.value === undefined || this.distribution.value === '' ||
      this.confidence.value === undefined || this.confidence.value === '') {
      // An error occured
      this.errorOccured = true;
    } else {
      // Everything fine, store the results
      this.storeCurrentData();
      // Show the next dataset
      this.distribution.value = undefined;
      this.confidence.value = undefined;
      this.errorOccured = false;
      this.numQuestion += 1;
      this.totalNumQuestion += 1;
      const currentDataset = this.numQuestion - 1;
      this.currentSampleSize = this.datasetSample[currentDataset].sampleSize;
      this.drawHistogram(this.datasetSample[currentDataset]);
      if (this.numQuestion === this.maxQuestions) {
        this.isNext = false;
        this.isLast = true;
      }
    }
  }

  /** After last data sample, save results. */
  public onSaveBtnClicked(): void {
    if (this.distribution.value === undefined || this.distribution.value === '' ||
      this.confidence.value === undefined || this.confidence.value === '') {
      // An error occured
      this.errorOccured = true;
    } else {
      // Everything fine, store the results
      this.storeCurrentData();
      // Finalize results
      const studyResults = [];
      for (const dt of this.datasetSample) {
        studyResults.push({
          dataset: dt.id,
          answer: dt.answer,
          confidence: dt.confidence,
          time: dt.timing
        });
      }
      this.participant.storeStudyResuls(studyResults);
    }
  }

  /** For drawing a histogram in D3. */
  private drawHistogram(dataset: Dataset): void {
    d3.select(this.svgplot.nativeElement).selectAll('*').remove();

    // Create g for drawing
    const canvas = d3.select(this.svgplot.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + this.plotMargin.left + ',' + this.plotMargin.top + ')');

    // Create axes
    const xDomain = [0, 100];
    const x = d3.scaleLinear().domain([xDomain[0], xDomain[1]]).range([0, this.plotWidth]);
    const y = d3.scaleLinear().domain([0, d3.max(dataset.bins)]).range([this.plotHeight, 0]);

    // Make a bin array that is useable for D3
    const d3Bins = [];
    const step = (xDomain[1] - xDomain[0]) / dataset.numBins;
    for (let b = 0; b < dataset.numBins; b++) {
      const d3Bin = {
        x1: b * step,
        x2: (b * step) + step,
        y: dataset.bins[b]
      };
      d3Bins.push(d3Bin);
    }

    canvas.selectAll('rect')
      .data(d3Bins)
      .enter()
      .append('rect')
        .attr('x', 1)
        .attr('transform', (d) => 'translate(' + x(d.x1) + ',' + y(d.y) + ')')
        .attr('width', (d) => x(d.x2) - x(d.x1) - 1)
        .attr('height', (d) => this.plotHeight - y(d.y))
        .attr('fill', 'Steelblue')
        .attr('stroke', 'DarkSlateGrey');

    canvas.append('g')
      .attr('transform', 'translate(0,' + this.plotHeight + ')')
      .call(d3.axisBottom(x));

    canvas.append('g')
      .call(d3.axisLeft(y));

    canvas.selectAll('text').remove();
  }

  // Store the current form data
  private storeCurrentData(): void {
    const currentDataset = this.numQuestion - 1;
    this.datasetSample[currentDataset].answer = this.distribution.value;
    this.datasetSample[currentDataset].confidence = Number(this.confidence.value);
    const timeNow = new Date().getTime();
    this.datasetSample[currentDataset].timing = timeNow - this.currentTimeStart;
  }

  private getRandomDatasetArray(size): number[] {
    const sample = [];
    let idx = 0;
    while (idx < size) {
      const rindex = StudyComponent.getRandominInterval(0, this.numDatasets - 1);
      if (!sample.includes(rindex)) {
        sample.push(rindex);
        idx += 1;
      }
    }
    return sample;
  }

}
