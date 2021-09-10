/**
 * This class describes a dataset.
 * @class
 * @classdesc Dataset represents a dataset.
 */
export class Dataset {

  public id: number;

  public sampleSize: number;

  public numBins: number;
  public bins: number[];

  public answer: string;
  public confidence: number;
  public timing: number;

}
