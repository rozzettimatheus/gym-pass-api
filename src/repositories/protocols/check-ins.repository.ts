import { CheckIn, Prisma } from '@prisma/client'

/**
 * Prisma.CheckInCreateInput:
 *  => é para criar um checkIn, usuário e academia ao mesmo tempo
 *
 * Prisma.CheckInUncheckedCreateInput:
 *  => só cria os relacionamentos (gym e user já precisam ser existentes)
 */
export interface ICheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}
