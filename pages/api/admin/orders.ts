import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { onError } from '@utils/error';
import { isAuth, isAdmin } from '@utils/auth/auth';
import Order from '@models/Order/Order';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const orders = await Order.find({}).populate('user', 'name');
  await db.disconnect();
  res.send(orders);
});

export default handler;
