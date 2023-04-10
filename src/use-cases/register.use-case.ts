import type { User } from '@prisma/client'

import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { IUseCase } from './protocols/use-case'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { IHashable } from '@/providers/hash/contracts/hashable'

type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

type RegisterUseCaseResponse = {
  user: User
}

export class RegisterUseCase
  implements IUseCase<RegisterUseCaseRequest, RegisterUseCaseResponse>
{
  constructor(
    private usersRepository: IUsersRepository,
    private hashProvider: IHashable,
  ) {}

  async run({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await this.hashProvider.hash(password, 6)
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
