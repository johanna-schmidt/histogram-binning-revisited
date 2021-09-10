import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SampleDataset } from '../data/SampleDataset';
import { SampleDatasetResult } from '../data/SampleDatasetResult';
import * as d3 from 'd3';

declare var require: any;

@Component({
  selector: 'app-alldatasets',
  templateUrl: './alldatasets.component.html',
  styleUrls: ['./alldatasets.component.css']
})
export class AllDatasetsComponent implements AfterViewInit {

  constructor(private route: ActivatedRoute) {
    this.datasetSample = [];
    this.datasetSampleResuls = [];
    const studydatasets = require('../data/studydatasets.json');
    const results = require('../data/results.json');
    for (let d = 0; d < 160; d++) {
      // Store dataset
      const dataset = new SampleDataset(d + '', studydatasets[d].distribution, studydatasets[d].samples, studydatasets[d].bins);
      dataset.data = studydatasets[d].data;
      this.datasetSample.push(dataset);
      // Store results
      const datasetResults = new SampleDatasetResult(d + '');
      Object.values(results).forEach( (p) => {
        p['data'].results.forEach( (r) => {
          if (r.dataset === d) {
            if (AllDatasetsComponent.distributionIsTheSame(r.answer, studydatasets[d].distribution)) {
              datasetResults.correct += 1;
            } else {
              datasetResults.wrong += 1;
            }
          }
        });
      });
      this.datasetSampleResuls.push(datasetResults);
    }
  }

  private readonly datasetSample: SampleDataset[];
  private readonly datasetSampleResuls: SampleDatasetResult[];

  @ViewChild('plotcolumn01') plotColumn01: ElementRef;
  @ViewChild('plotcolumn02') plotColumn02: ElementRef;
  @ViewChild('plotcolumn03') plotColumn03: ElementRef;
  @ViewChild('plotcolumn04') plotColumn04: ElementRef;
  @ViewChild('plotcolumn05') plotColumn05: ElementRef;

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
    this.datasetSample.forEach( (d, idx) => {
      const idxP1 = idx + 1;
      this.drawHistogram(idxP1, d);
      d3.select('#plot' + idxP1 + 'distr').html(d.distribution);
      const html2 = 'Correct: <span style="color: green">' + this.datasetSampleResuls[idx].correct + '</span> | Wrong: <span style="color: red">' + this.datasetSampleResuls[idx].wrong + '</span>';
      d3.select('#plot' + idxP1 + 'result').html(html2);
    });
  }

  private drawHistogram(idx: number, dataset: SampleDataset): void {
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
      case 21:
      case 26:
      case 31:
      case 36:
      case 41:
      case 46:
      case 51:
      case 56:
      case 61:
      case 66:
      case 71:
      case 76:
      case 81:
      case 86:
      case 91:
      case 96:
      case 101:
      case 106:
      case 111:
      case 116:
      case 121:
      case 126:
      case 131:
      case 136:
      case 141:
      case 146:
      case 151:
      case 156:
        parentDiv = this.plotColumn01;
        break;
      case 2:
      case 7:
      case 12:
      case 17:
      case 22:
      case 27:
      case 32:
      case 37:
      case 42:
      case 47:
      case 52:
      case 57:
      case 62:
      case 67:
      case 72:
      case 77:
      case 82:
      case 87:
      case 92:
      case 97:
      case 102:
      case 107:
      case 112:
      case 117:
      case 122:
      case 127:
      case 132:
      case 137:
      case 142:
      case 147:
      case 152:
      case 157:
        parentDiv = this.plotColumn02;
        break;
      case 3:
      case 8:
      case 13:
      case 18:
      case 23:
      case 28:
      case 33:
      case 38:
      case 43:
      case 48:
      case 53:
      case 58:
      case 63:
      case 68:
      case 73:
      case 78:
      case 83:
      case 88:
      case 93:
      case 98:
      case 103:
      case 108:
      case 113:
      case 118:
      case 123:
      case 128:
      case 133:
      case 138:
      case 143:
      case 148:
      case 153:
      case 158:
        parentDiv = this.plotColumn03;
        break;
      case 4:
      case 9:
      case 14:
      case 19:
      case 24:
      case 29:
      case 34:
      case 39:
      case 44:
      case 49:
      case 54:
      case 59:
      case 64:
      case 69:
      case 74:
      case 79:
      case 84:
      case 89:
      case 94:
      case 99:
      case 104:
      case 109:
      case 114:
      case 119:
      case 124:
      case 129:
      case 134:
      case 139:
      case 144:
      case 149:
      case 154:
      case 159:
        parentDiv = this.plotColumn04;
        break;
      case 5:
      case 10:
      case 15:
      case 20:
      case 25:
      case 30:
      case 35:
      case 40:
      case 45:
      case 50:
      case 55:
      case 60:
      case 65:
      case 70:
      case 75:
      case 80:
      case 85:
      case 90:
      case 95:
      case 100:
      case 105:
      case 110:
      case 115:
      case 120:
      case 125:
      case 130:
      case 135:
      case 140:
      case 145:
      case 150:
      case 155:
      case 160:
        parentDiv = this.plotColumn05;
        break;
    }
    plotFormat.width = (parentDiv.nativeElement.clientWidth - 40) - plotFormat.margin.left - plotFormat.margin.right;
    plotFormat.height = 200 - plotFormat.margin.bottom - plotFormat.margin.top;
    d3.select('#plot' + idx).selectAll('*').remove();

    // Create g for drawing
    const canvas = d3.select('#plot' + idx)
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
