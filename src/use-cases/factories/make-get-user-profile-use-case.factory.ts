import { PrismaUsersRepository } from '@/repositories/implementations/prisma/prisma-users.repository'
import { GetUserProfileUseCase } from '../get-user-profile.use-case'

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new GetUserProfileUseCase(usersRepository)
}
