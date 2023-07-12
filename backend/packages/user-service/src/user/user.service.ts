import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TUserInfo } from '@collection.io/access-jwt';
import { DatabaseService, User, UserRole } from '@collection.io/prisma';
import { SearchUserDto, UpdateUserDto, UserDto, UserWithHash } from './dto';
import { compare, hash } from 'bcrypt';

function getSelectQuery(info: TUserInfo) {
  return {
    id: true,
    name: true,
    lastLogin: true,
    createdAt: true,
    role: true,
    status: true,
    avatarUrl: true,
    email: info?.role === UserRole.ADMIN,
  };
}

// TODO Move these to access-jwt package

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await hash(password, saltRounds);
}

async function comparePasswords(password: string, hash: string) {
  return await compare(password, hash);
}

type UpdateData = Partial<Pick<User, 'name' | 'avatarUrl' | 'hash' | 'email'>>;
@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async update(id: number, dto: UpdateUserDto, info: TUserInfo) {
    const user = await this.get(id, info, true);

    if (!user.hash) throw new Error('Hash is required to process!'); 

    if (info.id !== id && info.role !== UserRole.ADMIN)
      throw new ForbiddenException({
        message: 'Forbidden',
        messageCode: 'user.forbidden',
      });

    const updateData: UpdateData = { ...dto };
    delete updateData.avatarUrl;

    // TODO Make email validation
    delete updateData.email;

    if (dto.avatarUrl || dto.avatarUrl === null)
      updateData.avatarUrl = dto.avatarUrl;
    if (dto.password && await comparePasswords(dto.password.old, user.hash)) {
      updateData.hash = await hashPassword(dto.password.new);
    }

    return await this.db.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
      },
    });
  }

  async get(
    id: number,
    info: TUserInfo,
    includeHash = false,
  ): Promise<UserWithHash> {
    const user = await this.db.user.findUnique({
      select: {
        ...getSelectQuery(info),
        hash: includeHash,
      },
      where: {
        id,
      },
    });

    if (!user)
      throw new NotFoundException({
        message: 'User was not found!',
        messageCode: 'user.notFound',
      });

    return {
      ...user,
      avatarUrl: user.avatarUrl ? user.avatarUrl : undefined,
    };
  }

  async search(dto: SearchUserDto, info: TUserInfo): Promise<UserDto[]> {
    const wherePart = dto.searchBy
      ? {
          name: {
            contains: dto.searchBy,
          },
        }
      : {};

    const users = await this.db.user.findMany({
      select: getSelectQuery(info),
      where: wherePart,
      orderBy: {
        name: 'asc',
      },
    });

    return users.map((user) => ({
      ...user,
      avatarUrl: user.avatarUrl ? user.avatarUrl : undefined,
    }));
  }
}
