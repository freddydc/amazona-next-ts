import nc from 'next-connect';
import { isAuth, signToken } from '@utils/auth/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Users } from '@utils/types';
import bcrypt from 'bcryptjs';
import User from '@models/User/User';
import db from '@database';

const handler = nc();
handler.use(isAuth);

handler.put(
  async (req: NextApiRequest & { user: Users }, res: NextApiResponse) => {
    await db.connect();
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password;
    await user.save();
    await db.disconnect();

    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
);

export default handler;
