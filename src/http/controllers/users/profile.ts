import { ResourceNotFoundError } from '@/use-cases/errors'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'
import { FastifyReply, FastifyRequest } from 'fastify'

export class ProfileController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const { user } = await this.getUserProfileUseCase.execute({ userId })

      const userWithoutPasswordHash = {
        ...user,
        password_hash: undefined,
      }

      return reply.status(200).send({ user: userWithoutPasswordHash })
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(409).send({ message: err.message })
      }
      throw err
    }
  }
}
