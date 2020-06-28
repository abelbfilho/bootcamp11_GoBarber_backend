"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let createAppointment;
let fakeNotificationsRepository;
let fakeCacheProvider;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 5, 20, 14),
      provider_id: '12121212',
      user_id: 'user'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12121212');
  });
  it('should NOT be able to create two appointments on the same date/time', async () => {
    const appointmentDate = new Date(2020, 5, 8, 11);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '12121212',
      user_id: 'user'
    });
    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '12121212',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to create an appointments on a past date/time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 10, 12),
      provider_id: '12121212',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 21, 12),
      provider_id: 'user',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should NOT be able to create an appointments before start hour and after end hour', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 20, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 21, 7),
      provider_id: 'provider',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2020, 5, 21, 18),
      provider_id: 'provider',
      user_id: 'user'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});