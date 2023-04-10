import { CheckIn, Prisma } from '@prisma/client'
import { client } from '@/lib/prisma'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { IDateProvider } from '@/providers/date/contracts/date.provider'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  constructor(private dateProvider: IDateProvider) {}

  async findById(id: string) {
    return await client.checkIn.findUnique({ where: { id } })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = this.dateProvider.getStartOfDay(date)
    const endOfTheDay = this.dateProvider.getEndOfDay(date)

    return await client.checkIn.findFirst({
      where: {
        // range using gte / lte
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
  }

  async findManyByUserId(userId: string, page: number) {
    return await client.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20, // items per page
      skip: (page - 1) * 20, // offset
    })
  }

  async countByUserId(userId: string) {
    return await client.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await client.checkIn.create({ data })
  }

  async save(data: CheckIn) {
    return await client.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
