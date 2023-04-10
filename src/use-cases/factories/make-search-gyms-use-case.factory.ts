import { PrismaGymsRepository } from '@/repositories/implementations/prisma/prisma-gyms.repository'
import { SearchGymsUseCase } from '../search-gyms.use-case'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  return new SearchGymsUseCase(gymsRepository)
}
