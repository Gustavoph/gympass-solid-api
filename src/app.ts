import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { env } from './env'
import { appRoutes } from './http/controllers/routes'

export const app = fastify()
app.register(fastifyJwt, {
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

appRoutes(app)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Valid error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
