import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      phone: '12345678',
      latitude: -23.39037,
      longitude: -51.8882552,
      title: 'Javascript Gym',
      description: 'An Javascript Gym',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
