import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(gymId: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === gymId) || null
  }
}
