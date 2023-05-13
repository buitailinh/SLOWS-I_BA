export class AppKey {
  static readonly TABLES = {
    /* PLOP_INJECT_TABLE */
    PRIVACY_SETTING: 'PrivacySetting',
    RESOURCE_CONFIG: 'ResourceConfig',
    PRIVATE_LOUNGE: 'PrivateLounge',
    SUBSCRIBE_USER: 'SubscribeUser',
    DELIVERY_ADDRESS: 'DeliveryAddress',
    FOLLOW_USER: 'FollowUser',
    TEST: 'Test',
    ROLE: 'Role',
    ACTION: 'Action',
    ACCOUNT: 'Account',
    USER: 'User',
    DEPARTMENT: 'Department',
  };

  static readonly ERROR_MESSAGE = {
    SUCCESS: 'Success',
    BAD_REQUEST: 'Bad Request',
    DO_NOT_PERMISSIONS: 'You do not have permission to access resource!',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    DASHBOARD_TYPE_SEARCH_INVALID: 'Dashboard type search invalid!',

    /* PLOP_INJECT_ERROR_MESSAGE */
    PRIVACY_SETTING: {
      ERR_EXIST: 'PrivacySetting already exists!',
      ERR_NOT_EXIST: 'PrivacySetting is not exists!',
      ERR_UPDATE_FAILED: 'Update privacy setting failed!',
    },
    RESOURCE_CONFIG: {
      ERR_EXIST: 'ResourceConfig already exists!',
      ERR_NOT_EXIST: 'ResourceConfig is not exists!',
    },
    PRIVATE_LOUNGE: {
      ERR_EXIST: 'PrivateLounge already exists!',
      ERR_NOT_EXIST: 'PrivateLounge is not exists!',
      ERR_CREATE_FAILED: 'Create private lounge!',
      ERR_NOT_OWNER: 'You do not owner of private lounge!',
      ERR_UPDATE_FAILED: 'Update private lounge failed!',
      ERR_MISSING_REQUIRED_FIELD: 'Missing required feild monthly or yearly!',
      ERR_CANT_CREATE_SUBSCRIPTION: 'Create subscripton error.',
    },
    SUBSCRIBE_USER: {
      ERR_EXIST: 'SubscribeUser already exists!',
      ERR_NOT_EXIST: 'SubscribeUser is not exists!',
      ERR_SELF_SUBSCRIBE: 'Must be subscribe different user!',
      ERR_SUBSCRIBE_USER_FAILED: 'Subscribe user failed!',
      ERR_COUTRY_SUBSCRIPTION: 'Can not subcribe user in this country',
    },
    DELIVERY_ADDRESS: {
      ERR_EXIST: 'Delivery address already exists!',
      ERR_NOT_EXIST: 'Delivery address is not exists!',
      ERR_NOT_AUTHOR_ADDRESS: 'Not author address',
      ERR_CAN_NOT_DELETE_DEFAULT_ADDRESS: 'Can not delete default delivery address !',
    },
    FOLLOW_USER: {
      ERR_EXIST: 'Follow user already exists!',
      ERR_NOT_EXIST: 'Follow user is not exists!',
      ERR_SELF_FOLLOW: 'Must be follow different user',
    },
    ROLE: {
      ERR_EXIST: 'Role already exists!',
      ERR_NOT_EXIST: 'Role is not exists!',
    },
    ACTION: {
      ERR_EXIST: 'Action already exists!',
      ERR_NOT_EXIST: 'Action is not exists!',
      ACTION_NAME_IS_REQUIRED: 'Actions name is required',
    },
    ACCOUNT: {
      ERR_EXIST: 'Account already exists!',
      ERR_PHONE_EXIST: 'The phone number has been registered. Please use another phone number!',
      ERR_PHONE_NOT_EXIST: 'The phone number is not exists!',
      ERR_NOT_EXIST: 'Account is not exists!',
      ERR_PHONE_NOT_REGISTED: 'Account has not been registered',
      ERR_LOGIN_FAILED: 'Phone/ Email/ Username or Password is not correct. Try again or click Forgot password to reset it!',
      ERR_OTP_INVALID: 'Verification code is expired or not correct. Please try again!',
      ERR_OTP_EXCEED_TIMES: 'You have requested OTP %otpLimit% times today. Please try again tomorrow!',
      ERR_WRONG_EMAIL_OR_PASSWORD: 'Wrong email or password',
      ERR_INVALID_PASSWORD: 'Your password must be at least 8 characters long, contain at least one number, symbol and have a mixture of uppercase, lowercase letters. Try again!',
      ERR_WRONG_PASSWORD: 'Wrong current password. Please try again',
      ERR_COINCIDE_PASSWORD: 'The new password must be different from the previous one!',
      ERR_WRONG_CONFIRM_PASSWORD: 'Wrong confirmed password. Please try again!',
      ERR_ACCESS_TOKEN_INVALID: 'Accesstoken is invalid!',
      ERR_INFOR_TOKEN_INVALID: 'Infor is invalid!',
      ERR_CAN_NOT_FIND_ACCOUNT: 'Can not find Account !',
      ERR_USER_NAME_EXIST: 'The username has been registered, please use another username!',
      ERR_EMAIL_EXIST: 'The email address has been registered. Please use another email!',
    },
    USER: {
      ERR_EXIST: 'User already exists!',
      ERR_NOT_EXIST: 'User is not exists!',
      ERR_ID_NOT_VALID: 'Id user not valid!',
      ERR_CANT_CHANGE_ROLE: 'Can not change role!',
      ERR_PHONE_EXIST: 'Phone number already exists!',
      ERR_EMAIL_EXIST: 'Email already exists!',
      ERR_NOT_EMAIL_EXIST: 'Email is not exists!',
      ERR_ACCOUNT_INVALID: 'User is invalid!',
      ERR_REFERRAL_CODE_WRONG: 'Wrong referral code. Please try again!'
    },
    DEPARTMENT: {
      ERR_EXIST: ' DEPARTMENTS already exists!',
      ERR_NOT_EXIST: ' DEPARTMENTS is not exists!',
      ERR_ID_NOT_VALID: 'Id  DEPARTMENTS not valid!',
      ERR_CANT_CHANGE_ROLE: 'Can not change role!',
      ERR_PHONE_EXIST: 'Phone number already exists!',
      ERR_EMAIL_EXIST: 'Email already exists!',
      ERR_ACCOUNT_INVALID: ' DEPARTMENTS is invalid!',
      ERR_REFERRAL_CODE_WRONG: 'Wrong referral code. Please try again!'
    },
  };

  static readonly CODE_PREFIX = {
    /* PLOP_INJECT_CODE_PREFIX */
    ACCOUNT: 'AC',
    USER: 'US',
    USER_NAME_DEFAULT: 'Ulalive',
    LENGTH: 6,
  };

  static readonly ACTION = {
    BASIC_ACCOUNT: {
      BILLING_MONTHLY: 'free',
      BILLING_ANNUALLY: 'free',
      BADGE: 'no',
      VIDEO_QUALITY: 720, // '720p HD'
      LIVE_MAX_LENGTH: 1, // hours
      INVITE_GUEST: 1,
      ADD_PRODUCT: 1,
      OWN_A_CHAT_ROOM: 'no',
      PRIVACY_SETTING: 'no',
      ANALYTICS: 'no'
    },
    LITE_ACCOUNT: {
      BILLING_MONTHLY: '$5',
      BILLING_ANNUALLY: '$1',
      BADGE: 'yes',
      VIDEO_QUALITY: 720, // '720p HD'
      LIVE_MAX_LENGTH: 1, // hours
      INVITE_GUEST: 3,
      ADD_PRODUCT: 1,
      OWN_A_CHAT_ROOM: 'yes',
      PRIVACY_SETTING: 'no',
      ANALYTICS: 'no'
    },
    PRO_ACCOUNT: {
      BILLING_MONTHLY: '$15',
      BILLING_ANNUALLY: '$9',
      BADGE: 'yes',
      VIDEO_QUALITY: 1080, // '1080p HD'
      LIVE_MAX_LENGTH: 4, // hours
      INVITE_GUEST: 3,
      ADD_PRODUCT: 3,
      OWN_A_CHAT_ROOM: 'yes',
      PRIVACY_SETTING: 'yes',
      ANALYTICS: 'no'
    }
  };

  static readonly REFERRAL_CODE_PREFIX = {
    LENGTH: 6,
  };

}
