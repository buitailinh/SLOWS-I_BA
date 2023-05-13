export interface IAdminPayload {
  sub: string;
  email: string;
  fullName: string;
}

export interface IUserPayload {
  sub: string;
  fullName: string;
  country?: string;
  status: string;
  statusSeller: string;
}
