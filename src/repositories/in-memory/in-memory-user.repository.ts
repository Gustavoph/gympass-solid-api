import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { IUserRepository } from 'repositories/user.repository'

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<void> {
    this.users.push({
      ...data,
      created_at: new Date(),
      id: randomUUID(),
      role: 'MEMBER',
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email)
    return user || null
  }
}
