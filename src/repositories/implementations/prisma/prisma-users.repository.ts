import { client } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'

import { IUsersRepository } from '@/repositories/protocols/users.repository'

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await client.user.findUnique({ where: { email } })
  }

  async create(data: Prisma.UserCreateInput) {
    return await client.user.create({
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    return await client.user.findUnique({ where: { id } })
  }
}
