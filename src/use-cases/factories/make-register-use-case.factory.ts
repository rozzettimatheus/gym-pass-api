import { PrismaUsersRepository } from '@/repositories/implementations/prisma/prisma-users.repository'
import { RegisterUseCase } from '../register.use-case'

export function makeRegisterUseCase() {
  const repository = new PrismaUsersRepository()
  return new RegisterUseCase(repository)
}
