/**
 * @class CommonModel
 * @description environment running, note (require environment nameming is lowercase)
 */
export enum Environment {
  local = 'local',
  production = 'production',
  staging = 'staging',
  dev = 'dev',
  test = 'test',
}

export enum RolesGroup {
  PARTNER = 'partner',
  ONLINE_STORE = 'online_store',
}

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export enum Strategy {
  ClientId = 'x-vmo-client-id',
  ClientSecret = 'x-vmo-client-secret',
  ClientDevice = 'x-vmo-device',
}

export enum ServiceOption {
  FILE = 'file',
  USER = 'user',
  SHOPPING = 'shopping',
  NOTIFICATION = 'notification',
  SOCIAL = 'social',
  FINANCE = 'finance'
}

export enum Headers {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
}
