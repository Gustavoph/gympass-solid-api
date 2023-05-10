import { FastifyReply, FastifyRequest } from 'fastify'

export class RefreshController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const { role } = request.user

    const accessToken = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )

    const refresh = await reply.jwtSign(
      { role },
      {
        sign: {
          sub: request.user.sub,
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
  }
}
