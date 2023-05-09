import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

namespace FetchNearbyGyms {
  export type Params = {
    userLatitude: number
    userLongitude: number
  }
  export type Response = {
    gyms: Gym[]
  }
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGyms.Params): Promise<FetchNearbyGyms.Response> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
