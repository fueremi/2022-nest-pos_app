import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //#region //? Create User
  async create(payload: CreateUserDTO) {
    const password = await argon.hash(payload.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken!');
        }
      }
    }
  }
  //#endregion
  //#region //? Find All Users
  async findAll() {
    const users: User[] = await this.prisma.user.findMany();
    users.map((user) => delete user.password);
    return users;
  }
  //#endregion
  //#region //? Find User By Id
  async findById(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    delete user.password;
    return user;
  }
  //#endregion
  //#region //? Update User
  async update(userId: string, payload: UpdateUserDTO) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...payload,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken!');
        }
        if (error.code === 'P2025') {
          throw new BadRequestException('User ID Incorrect!');
        }
      }
    }
  }
  //#endregion
  //#region //? Delete User
  async delete(userId: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('User ID Incorrect!');
        }
      }
    }
  }
  //#endregion
}
