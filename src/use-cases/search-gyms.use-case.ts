import type { Gym } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IGymsRepository } from '@/repositories/protocols/gyms.repository'

type SearchGymsUseCaseRequest = {
  query: string
  page: number
}

type SearchGymsUseCaseResponse = {
  gyms: Gym[]
}

export class SearchGymsUseCase
  implements IUseCase<SearchGymsUseCaseRequest, SearchGymsUseCaseResponse>
{
  constructor(private gymsRepository: IGymsRepository) {}

  async run({
    page,
    query,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
