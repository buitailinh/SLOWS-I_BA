import { v4 } from 'uuid';
import { redis } from './redis';

export const confirmEmailLink = async (userId: number) => {
  const id = v4();

  await redis.set(id, userId, "EX", 60 * 60 * 15);

  return `${process.env.BACKEND_HOST}/api/v1/user/confirm/${id}`;
};
