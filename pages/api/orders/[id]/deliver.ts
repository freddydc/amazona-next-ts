import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import Order from '@models/Order/Order';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Order delivered', order: deliveredOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found' });
  }
});

export default handler;
