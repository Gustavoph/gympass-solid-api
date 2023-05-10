import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { appRoutes } from './http/controllers/routes'

import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

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
