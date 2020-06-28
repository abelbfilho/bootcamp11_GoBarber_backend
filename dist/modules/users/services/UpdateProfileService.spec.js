"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeHashProvider;
let fakeUsersRepository;
let updateProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUsersRepository = new _FakeUsersRepository.default();
    updateProfile = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com'
    });
    expect(updatedUser.name).toBe('John XYZ Doe');
    expect(updatedUser.email).toBe('johnxyzdoe@example.com');
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'johnjohn'
    });
    const user = await fakeUsersRepository.create({
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      password: 'johnjohn'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John X Doe',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      old_password: 'johnjohn',
      password: 'johndoe123'
    });
    expect(updatedUser.password).toBe('johndoe123');
  });
  it('should NOT be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      password: 'johndoe123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John XYZ Doe',
      email: 'johnxyzdoe@example.com',
      old_password: 'johnxdoe',
      password: 'johndoe123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to update the profile from non-existing user', async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-user',
      name: 'John Doe',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});