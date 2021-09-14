import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '@utils/auth/auth';
import Order from '@models/Order/Order';
import db from '@database';

const handler = nc();
handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
