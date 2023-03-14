import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate.use-case'

// factory pattern - make instances only!
export function makeAuthenticateUseCase() {
  // deps
  const repository = new PrismaUsersRepository()

  return new AuthenticateUseCase(repository)
}