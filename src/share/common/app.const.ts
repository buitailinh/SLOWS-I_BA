export const COMMON_CONST = {
  PAGE_SIZE: 20,
  BCRYPT_HASH_ROUND: 12,
  UNIT_BILLION: 1000000000,
};

export const OTP_CONST = {
  LENGTH: 6,
  EFFECTIVE_TIME: 1 * 60000, // 300 second
  TIMES_LIMIT: 5,
  ONE_DAY: 24 * 60 * 60000,
  BLOCK_DURATIONS: 24 * 60 * 60000, // 24 hours
};

export class AppConst {
  static readonly API_PREFIX: string = 'api';
  static readonly API_VERSION: string = 'v1';
  static readonly PAGE_SIZE: number = 20;
  static readonly DEFAULT_COUTRY: 'US';
  static readonly DEFAULT_CURRENCY: 'USD';
  static readonly COMMON_ID_IS_REQUIRED: string = 'Id is required.';
  static readonly COMMON_ID_INVALID: string = 'Id invalid.';
  static readonly COMMON_DELETE_SUCCESS: string = 'Common delete success.';
  static readonly BCRYPT_HASH_ROUND: number = 10;
  static readonly PASSWORD_LENGTH: number = 8;

  static readonly NOTIFICATION_MAIL_SEND_OTP_ADMIN_FORGET_PASSWORD_SUBJECT = 'Your Ulalive admin verification code';
  static readonly NOTIFICATION_MAIL_SEND_EMAIL_PASSWORD_CREATE_NEW_USER_TITLE = `You have been registered to Ulalive Admin Panel`;
  static readonly NOTIFICATION_MAIL_SEND_EMAIL_PASSWORD_CREATE_NEW_USER_CONTENT = `Hi <email>,

  Congratulations, you have been registered to Ulalive Admin Panel.
  Here's your log in information:
  - Log in link:
  - Email: <email>
  - Password: <password>
  -----------------
  If this request is not from you, please just ignore this mail. Your mailbox is still totally safe.`;

  static readonly NOTIFICATION_PUSH_SUBSCRIBE_TITLE = 'Subscribe';
  static readonly NOTIFICATION_PUSH_SUBSCRIBE_CONTENT = `<username> started subscribing you`;
}
