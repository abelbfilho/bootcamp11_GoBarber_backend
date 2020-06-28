"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let fakeCacheProvider;
describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
  });
  it('should be able to authenticate', async () => {
    const createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    const authenticateUser = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
    const user = await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    const response = await authenticateUser.execute({
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should NOT be able to authenticate with an invalid user', async () => {
    const createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    const authenticateUser = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
    await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    await expect(authenticateUser.execute({
      email: 'johnxdoeeeee@example.com',
      password: 'johnjohn'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to authenticate with an wrong password', async () => {
    const createUser = new _CreateUserService.default(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    const authenticateUser = new _AuthenticateUserService.default(fakeUsersRepository, fakeHashProvider);
    await createUser.execute({
      name: 'John X Doe',
      email: 'johnxdoe@example.com',
      password: 'johnjohn'
    });
    await expect(authenticateUser.execute({
      email: 'johnxdoe@example.com',
      password: 'johnXjohn'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});