import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import { Users as User } from '@utils/types';
import Order from '@models/Order/Order';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth);

handler.get(
  async (req: NextApiRequest & { user: User }, res: NextApiResponse) => {
    await db.connect();
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  }
);

export default handler;
