import { env } from 'env'
import fastify from 'fastify'
import { appRoutes } from 'http/routes'
import { ZodError } from 'zod'

export const app = fastify()
appRoutes(app)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV === 'dev') {
    console.log(error.stack)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
