import type { NextApiRequest, NextApiResponse } from 'next';
import Product from '@models/Product/Product';
import nc from 'next-connect';
import db from '@database';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
