import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuth, isAdmin } from '@utils/auth/auth';
import Product from '@models/Product/Product';
import db from '@database';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
