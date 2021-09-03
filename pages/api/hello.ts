import type { NextApiRequest, NextApiResponse } from 'next';
// import db from '@utils/database/db';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // await db.connect();
  // await db.disconnect();
  res.status(200).json({ name: 'John Doe' });
}
