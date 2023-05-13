import { HttpStatus } from '@nestjs/common';
import { ValidationPipe } from './../pipe/validation.pipe';
/* eslint-disable no-useless-escape */
export const PatternLib = {
  name: /^\w+[A-Za-z\s\d]+$/,
  nameSpecial: /[~!@#$%^&*()-+=<>,?\/\\:;"']/,
  email: /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
  password: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
  phone: /^(\+?84|0)(3[2-9]|5[689]|7[0|6-9]|8[1-9]|9[0-9]|1[2-9][0-9])[0-9]{7}$/,
  number: /^\d+$/,
  domainSession: /^https?:\/\/.*?domain.com$/,
  swaggerIgnore: /^https?:\/\/.*?domain.com\/document\/\?url.*$/,
  filterUserFromText: /(?<=\s|^)@[^\s]*/g,
};
