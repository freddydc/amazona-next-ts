import type { NextApiRequest, NextApiResponse } from 'next';
import { GError } from '@utils/types';
import db from '@database';

const getError = (err: GError) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

const onError = async (
  err: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
};

export { getError, onError };
