import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'

import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { InMemoryUsersRepository } from '@/repositories/implementations/in-memory/in-memory-users.repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate.use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let repository: IUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(repository)
  })

  it('should be able authenticate', async () => {
    await repository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.run({
      email: 'john.doe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able authenticate with incorrect email', async () => {
    await expect(() =>
      sut.run({
        email: 'john.doe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able authenticate with incorrect password', async () => {
    await repository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.run({
        email: 'john.doe@email.com',
        password: 'incorrect_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
