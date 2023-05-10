import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { CreateGymController } from './create'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FetchNearbyGymsGymController } from './nearby'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { SearchGymController } from './search'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

const createGymController = new CreateGymController(makeCreateGymUseCase())
const searchGymController = new SearchGymController(makeSearchGymsUseCase())
const fetchNearbyGymsGymController = new FetchNearbyGymsGymController(
  makeFetchNearbyGymsUseCase(),
)

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', (request, reply) =>
    createGymController.execute(request, reply),
  )

  app.get('/gyms/search', (request, reply) =>
    searchGymController.execute(request, reply),
  )

  app.get('/gyms/nearby', (request, reply) =>
    fetchNearbyGymsGymController.execute(request, reply),
  )
}
