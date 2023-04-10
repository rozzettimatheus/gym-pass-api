import { Gym, Prisma } from '@prisma/client'

import { client } from '@/lib/prisma'
import {
  FindManyNearbyParams,
  IGymsRepository,
} from '@/repositories/protocols/gyms.repository'

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string) {
    return await client.gym.findUnique({ where: { id } })
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // complex query - insert SQL directly
    return await client.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }

  async searchMany(query: string, page: number) {
    return await client.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.GymCreateInput) {
    return await client.gym.create({ data })
  }
}
