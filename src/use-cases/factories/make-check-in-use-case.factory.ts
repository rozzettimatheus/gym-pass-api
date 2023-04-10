import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { PrismaGymsRepository } from '@/repositories/implementations/prisma/prisma-gyms.repository'
import { CheckInUseCase } from '../check-in.use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  return new CheckInUseCase(checkInsRepository, gymsRepository)
}
