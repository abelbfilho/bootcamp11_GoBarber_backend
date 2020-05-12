import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
    });

    expect(updatedUser.name).toBe('John XYZ Doe');
    expect(updatedUser.email).toBe('johnxyzdoe@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'johnjohn',
    });

    const user = await fakeUsersRepository.create({
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John X Doe',
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      old_password: 'johnjohn',
      password: 'johndoe123',
    });

    expect(updatedUser.password).toBe('johndoe123');
  });

  it('should NOT be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John XYZ Doe',
        email: 'johnxyzdoe@example.com',
        password: 'johndoe123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John XYZ Doe',
        email: 'johnxyzdoe@example.com',
        old_password: 'johnxdoe',
        password: 'johndoe123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
