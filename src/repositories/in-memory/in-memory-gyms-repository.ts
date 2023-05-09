import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(gymId: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === gymId) || null
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const skip = (page - 1) * 20
    const limit = page * 20

    return this.gyms
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice(skip, limit)
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      created_at: new Date(),
      description: data.description ?? null,
      phone: data.phone ?? null,
      title: data.title,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.gyms.push(gym)

    return gym
  }
}
