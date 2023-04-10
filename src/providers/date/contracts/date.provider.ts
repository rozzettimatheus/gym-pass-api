export interface IDateProvider {
  parseDate(date: string | Date | undefined | null): Date | null
  getStartOfDay(date: Date): Date
  getEndOfDay(date: Date): Date
  isBeforeDate(date: Date, dateToCompare: Date): boolean
  isAfterDate(date: Date, dateToCompare: Date): boolean
  getDiffInMinutes(currentDate: Date, dateToCompare: Date): number
}
