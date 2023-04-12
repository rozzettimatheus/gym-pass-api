import { BCryptJSHashProvider } from '@/providers/hash/implementations/bcrypt.provider'
import { PrismaUsersRepository } from '@/repositories/implementations/prisma/prisma-users.repository'
import { RegisterUseCase } from '../register.use-case'

export function makeRegisterUseCase() {
  const repository = new PrismaUsersRepository()
  const bcryptHash = new BCryptJSHashProvider()
  return new RegisterUseCase(repository, bcryptHash)
}
