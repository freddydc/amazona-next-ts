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
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.payer.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Order Paid', order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order Not Found' });
  }
});

export default handler;
