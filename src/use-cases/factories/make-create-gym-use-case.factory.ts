import { PrismaGymsRepository } from '@/repositories/implementations/prisma/prisma-gyms.repository'
import { CreateGymUseCase } from '../create-gym.use-case'

export function makeCreateGymUseCase() {
  const gymRepository = new PrismaGymsRepository()
  return new CreateGymUseCase(gymRepository)
}
