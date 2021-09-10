
export class SampleDataset {

  public id: string;
  public distribution: string;
  public samples: number;
  public bins: number;
  public data: number[];

  constructor(i: string, d: string, s: number, b: number) {
    this.id = i;
    this.distribution = d;
    this.samples = s;
    this.bins = b;
  }

}
