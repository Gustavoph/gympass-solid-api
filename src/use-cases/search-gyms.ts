import type { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

namespace SearchGyms {
  export type Params = {
    query: string
    page: number
  }

  export type Result = {
    gyms: Gym[]
  }
}

export class SearchGymsUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    page,
    query,
  }: SearchGyms.Params): Promise<SearchGyms.Result> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
