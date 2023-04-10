import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { ValidateCheckInUseCase } from '../validate-check-in.use-case'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new ValidateCheckInUseCase(checkInsRepository)
}
