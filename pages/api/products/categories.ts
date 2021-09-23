import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Product from '@models/Product/Product';
import db from '@database';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const categories = await Product.find().distinct('category');
  await db.disconnect();
  res.send(categories);
});

export default handler;
