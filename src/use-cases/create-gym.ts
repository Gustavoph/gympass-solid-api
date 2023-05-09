import type { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCase.Params): Promise<CreateGymUseCase.Result> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}

export namespace CreateGymUseCase {
  export type Params = {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
  }

  export type Result = {
    gym: Gym
  }
}
