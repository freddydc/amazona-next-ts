import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

import { isAuth } from '@utils/auth/auth';

const handler = nc();
handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  res.send(process.env.GOOGLE_API_KEY || 'no_key');
});

export default handler;
