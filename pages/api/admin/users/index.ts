import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '@utils/auth/auth';
import User from '@models/User/User';
import db from '@database';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
