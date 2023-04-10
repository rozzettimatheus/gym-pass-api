import { client } from '@/lib/prisma'
import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async findById(id: string) {
    return await client.checkIn.findUnique({ where: { id } })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    return await client.checkIn.findFirst({
      where: {
        // range using gte / lte
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
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
