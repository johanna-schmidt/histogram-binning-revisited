export class StudyDates {

  public dates: Date[];

  constructor() {
    this.dates = [];
  }

  public getDates(startDate: Date, endDate: Date): Date[] {
    let currentDate: Date = startDate;
    while (currentDate <= endDate) {
      this.dates.push(currentDate);
      currentDate = this.addDays(currentDate);
    }
    return this.dates;
  }

  private addDays(currentDate): Date {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    return date;
  }

}
