import { DayJSDateProvider } from '@/providers/date/implementations/day-js.provider'
import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins-history.use-case'

export function makeFetchUserCheckInsHistoryUseCase() {
  const dayJsProvider = new DayJSDateProvider()
  const checkInsRepository = new PrismaCheckInsRepository(dayJsProvider)
  return new FetchUserCheckInsUseCase(checkInsRepository)
}
