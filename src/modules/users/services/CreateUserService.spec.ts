import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
  });
  it('should be able to create a new user', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    const user = await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    expect(user).toHaveProperty('id');
  });

  it('should NOT be able to create a new user with an existing email', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
    await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      createUser.execute({
        name: 'John X Doe',
        email: 'johnxdoe@example.com',
        password: 'johnjohn',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
