import { BCryptJSHashProvider } from '@/providers/hash/implementations/bcrypt.provider'
import { PrismaUsersRepository } from '@/repositories/implementations/prisma/prisma-users.repository'
import { AuthenticateUseCase } from '../authenticate.use-case'

// factory pattern - make instances only!
export function makeAuthenticateUseCase() {
  const bcryptProvider = new BCryptJSHashProvider()
  const repository = new PrismaUsersRepository()
  return new AuthenticateUseCase(repository, bcryptProvider)
}
