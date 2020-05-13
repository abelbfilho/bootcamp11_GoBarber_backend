import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
  });

  it('should be able to authenticate', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    const response = await authenticateUser.execute({
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should NOT be able to authenticate with an invalid user', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      authenticateUser.execute({
        email: 'johnxdoeeeee@example.com',
        password: 'johnjohn',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to authenticate with an wrong password', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      authenticateUser.execute({
        email: 'johnxdoe@example.com',
        password: 'johnXjohn',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
