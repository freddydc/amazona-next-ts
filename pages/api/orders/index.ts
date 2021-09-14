import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import Order from '@models/Order/Order';
import { Users as User } from '@utils/types';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth);

handler.post(
  async (req: NextApiRequest & { user: User }, res: NextApiResponse) => {
    await db.connect();
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
  }
);

export default handler;
