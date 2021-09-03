import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Product from '@models/Product/Product';
import db from '@database';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
