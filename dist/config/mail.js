"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: process.env.MAIL_NAME_FROM,
      email: process.env.MAIL_EMAIL_FROM
    }
  }
};
exports.default = _default;