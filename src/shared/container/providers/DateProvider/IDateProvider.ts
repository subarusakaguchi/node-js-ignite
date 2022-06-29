interface IDateProvider {
  compare(start_date, end_date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
}

export { IDateProvider };
