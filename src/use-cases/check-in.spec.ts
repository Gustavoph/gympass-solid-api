import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from './errors'

let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(gymsRepository, checkInsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      description: '',
      phone: '',
      title: 'Javascript Gym',
      latitude: -23.449361,
      longitude: -51.9474355,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.449361,
      userLongitude: -51.9474355,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 4, 4, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.449361,
      userLongitude: -51.9474355,
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.449361,
        userLongitude: -51.9474355,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 4, 4, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.449361,
      userLongitude: -51.9474355,
    })

    vi.setSystemTime(new Date(2022, 4, 6, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.449361,
      userLongitude: -51.9474355,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      created_at: new Date(),
      description: 'An Javascript Gym',
      phone: '12345678',
      title: 'Javascript Gym',
      latitude: new Decimal(-23.39037),
      longitude: new Decimal(-51.8882552),
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.449361,
        userLongitude: -51.9474355,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should not be able to check in on nonexistent gym', async () => {
    expect(async () => {
      await sut.execute({
        gymId: 'fake-gym-id',
        userId: 'user-01',
        userLatitude: -23.449361,
        userLongitude: -51.9474355,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
