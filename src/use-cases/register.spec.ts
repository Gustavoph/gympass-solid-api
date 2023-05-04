import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

const userRequestMock = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
}

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      ...userRequestMock,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      ...userRequestMock,
    })

    const isPasswordHashed = await compare(
      userRequestMock.password,
      user.password_hash,
    )

    expect(isPasswordHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    await registerUseCase.execute({ ...userRequestMock })

    expect(async () => {
      await registerUseCase.execute({ ...userRequestMock })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
