import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { email, password } = authenticateBodySchema.parse(request.body)

      const { user } = await this.authenticateUseCase.execute({
        email,
        password,
      })

      const accessToken = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
          },
        },
      )

      const refresh = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      )

      return reply
        .setCookie('refreshToken', refresh, {
          path: '/',
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({ accessToken })
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(400).send({ message: err.message })
      }
      throw err
    }
  }
}
