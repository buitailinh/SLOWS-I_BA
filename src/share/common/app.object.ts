export class AppObject {
  /**
   * @field morning start
   * @description define morningstar frequency
   * @type any
   */
  static readonly MORNINGSTAR_FREQUENCY = {
    DAILY: 'D',
    WEEKLY: 'W',
    MONTHLY: 'M',
    QUARTERLY: 'Q',
    YEARLY: 'Y',
  };

  static readonly UPLOAD_KEY = {
    ICON: 'icon',
  };
  /**
   * @field SCHEMA_OPTIONS
   * @description define option schema
   * @type any
   */
  static readonly SCHEMA_OPTIONS = {
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: false,
    timestamps: {
      createdAt: 'dateCreated',
      updatedAt: 'dateUpdated',
    },
  };

  static readonly SCHEMA_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DELETE: 'Deleted',
    BLOCK: 'Block',
  };

  static readonly ACCOUNT_MODULE = {
    TYPE: {
      GOOGLE: 'Google',
      APPLE: 'Apple',
      PHONE: 'Phone',
    },
    OTP: {
      LENGTH: 4,
      EFFECTIVE_TIME: 5 * 60000, // 300 second
      TIMES_LIMIT: 5,
      BLOCK_DURATIONS: 24 * 60 * 60000, // 24 hours
    },
    PASSWORD: {
      EFFECTIVE_TIME: 90 * 24 * 60 * 60000, // 90 day
      TIMES_LIMIT: 5,
      BLOCK_DURATIONS: 24 * 60 * 60000, // 24 hours
    },
    LOGIN: {
      EFFECTIVE_TIME: 90 * 24 * 60 * 60000, // 90 day time login user
    },
    DEVICE_TYPE: {
      ANDROID: 'android',
      IOS: 'ios'
    }
  };

  static readonly USER_MODULE = {
    ROLE: {
      PRO: 'Pro',
      LITE: 'Lite',
      BASIC: 'Basic',
      ADMIN: 'Admin',
      MANAGER: 'Manager',
      CS: 'Cs',
    },
    ACCOUNT_TYPE: {
      MOBILE: 'mobile',
      CRM: 'crm'
    },
    USER_ROLE: {
      EFFECTIVE_TIME: 14 * 24 * 60 * 60000, // 14 day time for Pro
    }
  };

  static readonly CHAT_MODULE = {
    TYPEROOM: {
      FRIEND: 'Friend',
      GRUOP: 'Group',
    },
    MESSAGES: {
      NONE: 1,
      RECALL: 2,
      DELETE: 3
    }
  }

  static readonly CURRENCY = {
    SGD: 'SGD',
    MYR: 'MYR',
    USD: 'USD',
  };
  static readonly LIST_COUNTRY = [
    {
      code: '65',
      isoCode: 'SG',
      currency: 'SGD'
    },
    {
      code: '60',
      isoCode: 'MY',
      currency: 'MYR'
    },
    {
      code: '1',
      isoCode: 'US',
      currency: 'USD'
    }
  ];

  static readonly SEND_MAIL = {
    subject: 'CHANGE FEE PRIVATE LOUNGE',
    message: `Subscription fee of {$username} will change to {$feePreviousChange}/month to {$feeAfterChange}/month from {$dateTime}.
    To continue your subscription at the new price, tap Agree.
    If you do not agree or take no action, your subscription expires at the end of your current billing period.`,
  };

  static readonly SEND_MAIL_OTP = {
    SUBJECT: 'Ulalive email verification ',
    MESSAGE: `Verify that you own <useremail>
    Use this security code to verify your email address to Ulalive account : <otp>`,
  };

  static readonly PRIVACY_STATUS = {
    ALLOW: true,
    NOT_ALLOW: false,
  };

  static readonly SUBSCRIBE_USER_PERIOD = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
  };

  static readonly UPGRADE_ACOUNT_TYPE = {
    MONTH: 'months',
    YEAR: 'years',
  };
}
