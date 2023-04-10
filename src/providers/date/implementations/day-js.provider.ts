import dayJS from 'dayjs'

import { IDateProvider } from '../contracts/date.provider'

export class DayJSDateProvider implements IDateProvider {
  parseDate(date: string | Date | null | undefined): Date | null {
    const parsedDate = dayJS(date)
    return parsedDate.isValid() ? parsedDate.toDate() : null
  }

  isBeforeDate(date: Date, dateToCompare: Date): boolean {
    return dayJS(date).isBefore(dateToCompare)
  }

  isAfterDate(date: Date, dateToCompare: Date): boolean {
    return dayJS(date).isAfter(dateToCompare)
  }

  getStartOfDay(date: Date): Date {
    return dayJS(date).startOf('date').toDate()
  }

  getEndOfDay(date: Date): Date {
    return dayJS(date).endOf('date').toDate()
  }

  getDiffInMinutes(currentDate: Date, dateToCompare: Date): number {
    return dayJS(currentDate).diff(dateToCompare, 'minutes')
  }
}
