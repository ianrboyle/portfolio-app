import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  beforeEach(async () => {
    const users: User[] = [];
    fakeAuthService = {
      signin: (email: string, password: string) => {
        const user = { id: 1, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      signup: (email: string, password: string) => {
        const user = { id: 1, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    fakeUsersService = {
      findOne: (id: number) => {
        // const filteredUser = users.find((u) => u.id === id);
        const filteredUser = {
          id,
          email: 'someEmail@test.com',
          password: 'asdf',
        } as User;
        return Promise.resolve(filteredUser);
      },
      find: (email: string) => {
        // const filteredUsers = users.filter((u) => u.email === email);
        const filteredUsers = [
          {
            id: 1,
            email,
            password: 'asdf',
          } as User,
        ];
        return Promise.resolve(filteredUsers);
      },
      update: (id: number, attrs: Partial<User>) => {
        // const partialUser = { id: 1, attrs } as Partial<User>;
        const user = users.find((u) => u.id === id && u.email === attrs.email);
        return Promise.resolve(user);
      },
      remove: (id: number) => {
        const user = {
          id,
          email: 'some@tests.com',
          password: 'password',
        } as User;
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
      controllers: [UsersController],
    }).compile();

    // const module = await Test.createTestingModule({
    //   providers: [
    //     AuthService,
    //     { provide: UsersService, useValue: fakeUsersService },
    //   ],
    // }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be find all users by email', async () => {
    // const user = await fakeUsersService.find();
    const users = await controller.findUserByEmail('test@test.com');
    expect(users).toBeDefined();
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('should be find one user by id', async () => {
    // const user = await fakeUsersService.find();
    const user = await controller.findUserById('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('findUserById throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUserById('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should signin a user', async () => {
    const session = { userId: 0 };
    const user = await controller.signinUser(
      { email: 'email@test.com', password: 'password' },
      session,
    );
    expect(user.email).toEqual('email@test.com');
    expect(session.userId).toEqual(user.id);
  });

  it('should signup a user', async () => {
    const session = { userId: 0 };
    const user = await controller.createUser(
      { email: 'email@test.com', password: 'password' },
      session,
    );
    expect(user.email).toEqual('email@test.com');
    expect(session.userId).toEqual(user.id);
  });
});
