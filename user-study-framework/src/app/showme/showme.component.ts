import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SampleDataset } from '../data/SampleDataset';
import * as d3 from 'd3';

declare var $: any;   // For jQuery
declare var require: any;

@Component({
  selector: 'app-showme',
  templateUrl: './showme.component.html',
  styleUrls: ['./showme.component.css']
})

export class ShowmeComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.tokenNotFound = true;
    this.datasetSample = [];
    const studydatasets = require('../data/studydatasets.json');
    for (let d = 0; d < 160; d++) {
      const dataset = new SampleDataset(d + '', studydatasets[d].distribution, studydatasets[d].samples, studydatasets[d].bins);
      dataset.data = studydatasets[d].data;
      this.datasetSample.push(dataset);
    }
  }

  private token: string;
  private sub: any;

  public tokenNotFound: boolean;

  private participantData: any;
  private readonly datasetSample: SampleDataset[];

  @ViewChild('plotcolumn01') plotColumn01: ElementRef;
  @ViewChild('plotcolumn02') plotColumn02: ElementRef;
  @ViewChild('plotcolumn03') plotColumn03: ElementRef;
  @ViewChild('plotcolumn04') plotColumn04: ElementRef;
  @ViewChild('plotcolumn05') plotColumn05: ElementRef;

  @ViewChild('plot01') plot01: ElementRef;
  @ViewChild('plot02') plot02: ElementRef;
  @ViewChild('plot03') plot03: ElementRef;
  @ViewChild('plot04') plot04: ElementRef;
  @ViewChild('plot05') plot05: ElementRef;
  @ViewChild('plot06') plot06: ElementRef;
  @ViewChild('plot07') plot07: ElementRef;
  @ViewChild('plot08') plot08: ElementRef;
  @ViewChild('plot09') plot09: ElementRef;
  @ViewChild('plot10') plot10: ElementRef;
  @ViewChild('plot11') plot11: ElementRef;
  @ViewChild('plot12') plot12: ElementRef;
  @ViewChild('plot13') plot13: ElementRef;
  @ViewChild('plot14') plot14: ElementRef;
  @ViewChild('plot15') plot15: ElementRef;
  @ViewChild('plot16') plot16: ElementRef;
  @ViewChild('plot17') plot17: ElementRef;
  @ViewChild('plot18') plot18: ElementRef;
  @ViewChild('plot19') plot19: ElementRef;
  @ViewChild('plot20') plot20: ElementRef;

  @ViewChild('plot01data') plot01Data: ElementRef;
  @ViewChild('plot01answer') plot01Answer: ElementRef;
  @ViewChild('plot02data') plot02Data: ElementRef;
  @ViewChild('plot02answer') plot02Answer: ElementRef;
  @ViewChild('plot03data') plot03Data: ElementRef;
  @ViewChild('plot03answer') plot03Answer: ElementRef;
  @ViewChild('plot04data') plot04Data: ElementRef;
  @ViewChild('plot04answer') plot04Answer: ElementRef;
  @ViewChild('plot05data') plot05Data: ElementRef;
  @ViewChild('plot05answer') plot05Answer: ElementRef;
  @ViewChild('plot06data') plot06Data: ElementRef;
  @ViewChild('plot06answer') plot06Answer: ElementRef;
  @ViewChild('plot07data') plot07Data: ElementRef;
  @ViewChild('plot07answer') plot07Answer: ElementRef;
  @ViewChild('plot08data') plot08Data: ElementRef;
  @ViewChild('plot08answer') plot08Answer: ElementRef;
  @ViewChild('plot09data') plot09Data: ElementRef;
  @ViewChild('plot09answer') plot09Answer: ElementRef;
  @ViewChild('plot10data') plot10Data: ElementRef;
  @ViewChild('plot10answer') plot10Answer: ElementRef;
  @ViewChild('plot11data') plot11Data: ElementRef;
  @ViewChild('plot11answer') plot11Answer: ElementRef;
  @ViewChild('plot12data') plot12Data: ElementRef;
  @ViewChild('plot12answer') plot12Answer: ElementRef;
  @ViewChild('plot13data') plot13Data: ElementRef;
  @ViewChild('plot13answer') plot13Answer: ElementRef;
  @ViewChild('plot14data') plot14Data: ElementRef;
  @ViewChild('plot14answer') plot14Answer: ElementRef;
  @ViewChild('plot15data') plot15Data: ElementRef;
  @ViewChild('plot15answer') plot15Answer: ElementRef;
  @ViewChild('plot16data') plot16Data: ElementRef;
  @ViewChild('plot16answer') plot16Answer: ElementRef;
  @ViewChild('plot17data') plot17Data: ElementRef;
  @ViewChild('plot17answer') plot17Answer: ElementRef;
  @ViewChild('plot18data') plot18Data: ElementRef;
  @ViewChild('plot18answer') plot18Answer: ElementRef;
  @ViewChild('plot19data') plot19Data: ElementRef;
  @ViewChild('plot19answer') plot19Answer: ElementRef;
  @ViewChild('plot20data') plot20Data: ElementRef;
  @ViewChild('plot20answer') plot20Answer: ElementRef;


  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.token = params.token;
      $.ajax({
        url: '/survey/b65a1cdb-3e04-4b8f-9ca2-190fae08cfa2/' + this.token,
        type: 'GET',
        dataType: 'json',
        success: (d) => {
          if (d.hasOwnProperty('data')) {
            this.participantData = d.data.results;
            this.tokenNotFound = false;
          } else {
            this.tokenNotFound = true;
          }
        }
      });
    });
    setTimeout(() => this.redraw(), 700);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.redraw();
  }

  private redraw(): void {
    if (!this.tokenNotFound && this.participantData !== undefined) {
      let idx = 1;
      this.participantData.forEach((pd) => {
        const dataset = this.datasetSample[pd.dataset];
        const answer = pd.answer;
        const distribution = dataset.distribution;
        const isCorrect = answer === distribution || (answer === 'normal_bimodal' && distribution === 'bimodal');
        switch (idx) {
          case 1:
            this.drawHistogram(idx, this.plot01, dataset);
            d3.select(this.plot01Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot01Answer.nativeElement).style('color', 'green');
              d3.select(this.plot01Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot01Answer.nativeElement).style('color', 'red');
              d3.select(this.plot01Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 2:
            this.drawHistogram(idx, this.plot02, dataset);
            d3.select(this.plot02Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot02Answer.nativeElement).style('color', 'green');
              d3.select(this.plot02Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot02Answer.nativeElement).style('color', 'red');
              d3.select(this.plot02Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 3:
            this.drawHistogram(idx, this.plot03, dataset);
            d3.select(this.plot03Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot03Answer.nativeElement).style('color', 'green');
              d3.select(this.plot03Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot03Answer.nativeElement).style('color', 'red');
              d3.select(this.plot03Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 4:
            this.drawHistogram(idx, this.plot04, dataset);
            d3.select(this.plot04Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot04Answer.nativeElement).style('color', 'green');
              d3.select(this.plot04Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot04Answer.nativeElement).style('color', 'red');
              d3.select(this.plot04Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 5:
            this.drawHistogram(idx, this.plot05, dataset);
            d3.select(this.plot05Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot05Answer.nativeElement).style('color', 'green');
              d3.select(this.plot05Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot05Answer.nativeElement).style('color', 'red');
              d3.select(this.plot05Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 6:
            this.drawHistogram(idx, this.plot06, dataset);
            d3.select(this.plot06Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot06Answer.nativeElement).style('color', 'green');
              d3.select(this.plot06Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot06Answer.nativeElement).style('color', 'red');
              d3.select(this.plot06Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 7:
            this.drawHistogram(idx, this.plot07, dataset);
            d3.select(this.plot07Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot07Answer.nativeElement).style('color', 'green');
              d3.select(this.plot07Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot07Answer.nativeElement).style('color', 'red');
              d3.select(this.plot07Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 8:
            this.drawHistogram(idx, this.plot08, dataset);
            d3.select(this.plot08Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot08Answer.nativeElement).style('color', 'green');
              d3.select(this.plot08Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot08Answer.nativeElement).style('color', 'red');
              d3.select(this.plot08Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 9:
            this.drawHistogram(idx, this.plot09, dataset);
            d3.select(this.plot09Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot09Answer.nativeElement).style('color', 'green');
              d3.select(this.plot09Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot09Answer.nativeElement).style('color', 'red');
              d3.select(this.plot09Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 10:
            this.drawHistogram(idx, this.plot10, dataset);
            d3.select(this.plot10Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot10Answer.nativeElement).style('color', 'green');
              d3.select(this.plot10Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot10Answer.nativeElement).style('color', 'red');
              d3.select(this.plot10Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 11:
            this.drawHistogram(idx, this.plot11, dataset);
            d3.select(this.plot11Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot11Answer.nativeElement).style('color', 'green');
              d3.select(this.plot11Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot11Answer.nativeElement).style('color', 'red');
              d3.select(this.plot11Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 12:
            this.drawHistogram(idx, this.plot12, dataset);
            d3.select(this.plot12Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot12Answer.nativeElement).style('color', 'green');
              d3.select(this.plot12Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot12Answer.nativeElement).style('color', 'red');
              d3.select(this.plot12Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 13:
            this.drawHistogram(idx, this.plot13, dataset);
            d3.select(this.plot13Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot13Answer.nativeElement).style('color', 'green');
              d3.select(this.plot13Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot13Answer.nativeElement).style('color', 'red');
              d3.select(this.plot13Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 14:
            this.drawHistogram(idx, this.plot14, dataset);
            d3.select(this.plot14Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot14Answer.nativeElement).style('color', 'green');
              d3.select(this.plot14Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot14Answer.nativeElement).style('color', 'red');
              d3.select(this.plot14Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 15:
            this.drawHistogram(idx, this.plot15, dataset);
            d3.select(this.plot15Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot15Answer.nativeElement).style('color', 'green');
              d3.select(this.plot15Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot15Answer.nativeElement).style('color', 'red');
              d3.select(this.plot15Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 16:
            this.drawHistogram(idx, this.plot16, dataset);
            d3.select(this.plot16Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot16Answer.nativeElement).style('color', 'green');
              d3.select(this.plot16Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot16Answer.nativeElement).style('color', 'red');
              d3.select(this.plot16Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 17:
            this.drawHistogram(idx, this.plot17, dataset);
            d3.select(this.plot17Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot17Answer.nativeElement).style('color', 'green');
              d3.select(this.plot17Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot17Answer.nativeElement).style('color', 'red');
              d3.select(this.plot17Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 18:
            this.drawHistogram(idx, this.plot18, dataset);
            d3.select(this.plot18Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot18Answer.nativeElement).style('color', 'green');
              d3.select(this.plot18Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot18Answer.nativeElement).style('color', 'red');
              d3.select(this.plot18Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 19:
            this.drawHistogram(idx, this.plot19, dataset);
            d3.select(this.plot19Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot19Answer.nativeElement).style('color', 'green');
              d3.select(this.plot19Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot19Answer.nativeElement).style('color', 'red');
              d3.select(this.plot19Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
          case 20:
            this.drawHistogram(idx, this.plot20, dataset);
            d3.select(this.plot20Data.nativeElement).html('Dataset: ' + dataset.distribution);
            if (isCorrect) {
              d3.select(this.plot20Answer.nativeElement).style('color', 'green');
              d3.select(this.plot20Answer.nativeElement).html('Your answer: ' + answer);
            } else {
              d3.select(this.plot20Answer.nativeElement).style('color', 'red');
              d3.select(this.plot20Answer.nativeElement).html('Your answer: ' + answer);
            }
            break;
        }
        idx += 1;
      });
    }
  }

  private drawHistogram(idx: number, svg: ElementRef, dataset: SampleDataset): void {
    const plotFormat = {
      margin: { top: 5, right: 5, bottom: 5, left: 5 },
      width: 0,
      height: 0
    };
    let parentDiv;
    switch (idx) {
      case 1:
      case 6:
      case 11:
      case 16:
        parentDiv = this.plotColumn01;
        break;
      case 2:
      case 7:
      case 12:
      case 17:
        parentDiv = this.plotColumn02;
        break;
      case 3:
      case 8:
      case 13:
      case 18:
        parentDiv = this.plotColumn03;
        break;
      case 4:
      case 9:
      case 14:
      case 19:
        parentDiv = this.plotColumn04;
        break;
      case 5:
      case 10:
      case 15:
      case 20:
        parentDiv = this.plotColumn05;
        break;
    }
    plotFormat.width = (parentDiv.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    d3.select(svg.nativeElement).selectAll('*').remove();

    // Create g for drawing
    const canvas = d3.select(svg.nativeElement)
      .append('g')
      .attr('transform', 'translate(' + plotFormat.margin.left + ',' + plotFormat.margin.top + ')');

    // Create axes
    const xDomain = [0, 100];
    const x = d3.scaleLinear().domain([xDomain[0], xDomain[1]]).range([0, plotFormat.width]);
    const y = d3.scaleLinear().domain([0, d3.max(dataset.data)]).range([plotFormat.height, 0]);

    // Make a bin array that is useable for D3
    const d3Bins = [];
    const step = (xDomain[1] - xDomain[0]) / dataset.bins;
    for (let b = 0; b < dataset.bins; b++) {
      const d3Bin = {
        x1: b * step,
        x2: (b * step) + step,
        y: dataset.data[b]
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
      .attr('height', (d) => plotFormat.height - y(d.y))
      .attr('fill', 'Steelblue')
      .attr('stroke', 'DarkSlateGrey');

    canvas.append('g')
      .attr('transform', 'translate(0,' + plotFormat.height + ')')
      .call(d3.axisBottom(x));

    canvas.append('g')
      .call(d3.axisLeft(y));

    canvas.selectAll('text').remove();
  }

}
