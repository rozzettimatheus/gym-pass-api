import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@prisma/client'

import { IUsersRepository } from '@/repositories/protocols/users.repository'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)

    return user || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    return user || null
  }
}
