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

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const newProduct = new Product({
    name: 'some name',
    slug: 'some-slug-' + Math.random().toString().substring(2, 8),
    image: '/images/camera.jpg',
    price: 0,
    category: 'some category',
    brand: 'some brand',
    countInStock: 0,
    description: 'some description',
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;
