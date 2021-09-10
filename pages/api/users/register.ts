import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '@models/User/User';
import db from '@database';
import { signToken } from '@utils/auth/auth';
import { Users } from '@utils/types';

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  });

  const user: Users = await newUser.save();
  await db.disconnect();
  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
