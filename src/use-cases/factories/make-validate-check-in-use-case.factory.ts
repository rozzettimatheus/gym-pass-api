import { DayJSDateProvider } from '@/providers/date/implementations/day-js.provider'
import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { ValidateCheckInUseCase } from '../validate-check-in.use-case'

export function makeValidateCheckInUseCase() {
  const dayJsProvider = new DayJSDateProvider()
  const checkInsRepository = new PrismaCheckInsRepository(dayJsProvider)
  return new ValidateCheckInUseCase(checkInsRepository, dayJsProvider)
}
