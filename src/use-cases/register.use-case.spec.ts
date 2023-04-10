import { expect, describe, it, beforeEach } from 'vitest'

import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { InMemoryUsersRepository } from '@/repositories/implementations/in-memory/in-memory-users.repository'
import { RegisterUseCase } from '@/use-cases/register.use-case'

import { BCryptJSHashProvider } from '@/providers/hash/implementations/bcrypt.provider'

import { UserAlreadyExistsError } from './errors/user-already-exists.error'

let hashProvider: BCryptJSHashProvider
let repository: IUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    hashProvider = new BCryptJSHashProvider()
    repository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(repository, hashProvider)
  })

  it('should be able to register', async () => {
    const { user } = await sut.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await hashProvider.compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a duplicate email', async () => {
    const email = 'john@doe.com'

    await sut.run({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.run({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
