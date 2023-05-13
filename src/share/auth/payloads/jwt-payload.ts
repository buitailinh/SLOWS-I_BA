import { ObjectID } from "typeorm";

export interface JwtPayload {
  userId: ObjectID;
  email: string;
  role: string;
  fullName: string;
  avatar: string;

}
