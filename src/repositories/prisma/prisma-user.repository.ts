import { Prisma, User } from '@prisma/client'
import { prisma } from 'lib/prisma'
import { IUserRepository } from 'repositories/user.repository'

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    await prisma.user.create({ data })
  }
}

export const userRepository = new PrismaUserRepository()
