import { DayJSDateProvider } from '@/providers/date/implementations/day-js.provider'
import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { GetUserMetricsUseCase } from '../get-user-metrics.use-case'

export function makeGetUserMetricsUseCase() {
  const dayJsProvider = new DayJSDateProvider()
  const checkInsRepository = new PrismaCheckInsRepository(dayJsProvider)
  return new GetUserMetricsUseCase(checkInsRepository)
}
