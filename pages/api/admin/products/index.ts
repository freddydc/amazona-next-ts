import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAdmin, isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import Product from '@models/Product/Product';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
