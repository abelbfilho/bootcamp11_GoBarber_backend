export default {
  jwt: {
    secret: `${process.env.APP_SECRET}`,
    expiresIn: '1d',
  },
};
// MD5ONLINE => SecureGoBarberAuthenticatePhrase <==> d16d417f26b0570b9c4117061b3e29d0
// refreshToken => Aplicação Mobile
// JWT.io
