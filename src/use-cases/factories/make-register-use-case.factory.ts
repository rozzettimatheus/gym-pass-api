import { PrismaUsersRepository } from '@/repositories/implementations/prisma/prisma-users.repository'
import { RegisterUseCase } from '../register.use-case'

// factory pattern
export function makeRegisterUseCase() {
  // deps
  const repository = new PrismaUsersRepository()

  return new RegisterUseCase(repository)
}
