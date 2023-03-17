import { CheckIn, Prisma } from '@prisma/client'

/**
 * Prisma.CheckInCreateInput:
 *  => é para criar um checkIn, usuário e academia ao mesmo tempo
 *
 * Prisma.CheckInUncheckedCreateInput:
 *  => só cria os relacionamentos (gym e user já precisam ser existentes)
 */
export interface ICheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
