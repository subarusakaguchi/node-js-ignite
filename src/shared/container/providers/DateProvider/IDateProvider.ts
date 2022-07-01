interface IDateProvider {
  compareInHours(start_date, end_date): number;
  compareInDays(start_date, end_date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
}

export { IDateProvider };
