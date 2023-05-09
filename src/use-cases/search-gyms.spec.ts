import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      phone: null,
      latitude: -23.39037,
      longitude: -51.8882552,
      description: null,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      phone: null,
      latitude: -23.39037,
      longitude: -51.8882552,
      description: null,
    })

    const { gyms } = await sut.execute({
      query: 'javascript',
      page: 1,
    })

    expect(gyms).toBeTruthy()
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript Gym - ${i}`,
        phone: null,
        latitude: -23.39037,
        longitude: -51.8882552,
        description: null,
      })
    }

    const { gyms } = await sut.execute({
      query: 'TypeScript',
      page: 2,
    })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript Gym - 21' }),
      expect.objectContaining({ title: 'TypeScript Gym - 22' }),
    ])
  })
})
