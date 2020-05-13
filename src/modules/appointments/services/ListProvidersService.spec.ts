// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Sarha Phill',
      email: 'sarhaphill@example.com',
      password: 'ahrasllihp',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Paul McDonnalds',
      email: 'paul@example.com',
      password: 'mcdonnalds',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
