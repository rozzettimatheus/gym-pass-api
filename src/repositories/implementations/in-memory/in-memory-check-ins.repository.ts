import { randomUUID } from 'node:crypto'
import { Prisma, CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { IDateProvider } from '@/providers/date/contracts/date.provider'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = []

  constructor(private dateProvider: IDateProvider) {}

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)
    return checkIn ?? null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: this.dateProvider.parseDate(data.validated_at),
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.checkIns.findIndex((item) => item.id === checkIn.id)

    if (index >= 0) {
      this.checkIns[index] = checkIn
    }

    return checkIn
  }

  // dummy impl first
  // then refactors it
  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = this.dateProvider.getStartOfDay(date)
    const endOfTheDay = this.dateProvider.getEndOfDay(date)

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const isOnSameDate =
        this.dateProvider.isAfterDate(checkIn.created_at, startOfTheDay) &&
        this.dateProvider.isBeforeDate(checkIn.created_at, endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    return checkInOnSameDate ?? null
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length
  }
}
