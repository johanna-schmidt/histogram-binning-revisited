
export class SampleDatasetResult {

  public name: string;

  public correct: number;
  public wrong: number;

  constructor(n: string) {
    this.name = n;
    this.correct = 0;
    this.wrong = 0;
  }

}
