import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

const userRequestMock = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123456',
}

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      ...userRequestMock,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({ ...userRequestMock })

    expect(async () => {
      await registerUseCase.execute({ ...userRequestMock })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
