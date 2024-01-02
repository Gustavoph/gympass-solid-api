import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as bcrypt from 'bcryptjs'
import { RegisterUseCase } from 'use-cases/register.use-case'
import { InMemoryUserRepository } from 'repositories/in-memory/in-memory-user.repository'
import { UserAlreadyExistsError } from 'use-cases/errors/user-already-exists-error'

let repository: InMemoryUserRepository
let useCase: RegisterUseCase

const makeUser = {
  name: 'fake-name',
  password: 'fake-password',
  email: 'fake-email@mail.com',
}

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUserRepository()
    useCase = new RegisterUseCase(repository)
  })

  it('should throw an error if try to register with same email', async () => {
    await useCase.execute(makeUser)
    await expect(() => useCase.execute(makeUser)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('should create an user', async () => {
    await useCase.execute(makeUser)
    const user = await repository.findByEmail(makeUser.email)
    expect(user?.id).toEqual(expect.any(String))
  })

  it('should encrypt the user password correctly', async () => {
    await useCase.execute(makeUser)
    const user = await repository.findByEmail(makeUser.email)
    expect(bcrypt.compare(makeUser.password, user!.password_hash))
  })
})
