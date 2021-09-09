import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Product from '@models/Product/Product';
import User from '@models/User/User';
import data from '@utils/data/data';
import db from '@database';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Seeded successfully' });
});

export default handler;
