interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}
export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: process.env.MAIL_NAME_FROM,
      email: process.env.MAIL_EMAIL_FROM,
    },
  },
} as IMailConfig;
