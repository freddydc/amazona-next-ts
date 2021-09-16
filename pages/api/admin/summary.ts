import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Order from '@models/Order/Order';
import Product from '@models/Product/Product';
import User from '@models/User/User';
import { isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import db from '@database';

const handler = nc({ onError });
handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
