import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'

export class FetchNearbyGymsGymController {
  constructor(
    private readonly fetchNearbyGymsUseCase: FetchNearbyGymsUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

    const { gyms } = await this.fetchNearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(201).send({ gyms })
  }
}
