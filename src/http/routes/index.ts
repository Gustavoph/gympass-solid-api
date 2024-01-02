import { FastifyInstance } from 'fastify'
import { Register } from 'http/controllers/register.controller'

export function appRoutes(app: FastifyInstance) {
  app.post('/api/users', Register)
}
