import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakestorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakestorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();
  });
  it('should be able to update the avatar', async () => {
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakestorageProvider
    );
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should NOT be able to update avatar for non existing user', async () => {
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakestorageProvider
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakestorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakestorageProvider
    );
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn',
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
