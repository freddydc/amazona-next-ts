import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ImgBuffer } from '@utils/types';
import { isAdmin, isAuth } from '@utils/auth/auth';
import { onError } from '@utils/error';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer();
const handler = nc({ onError });
handler.use(isAuth, isAdmin);
handler.use(upload.single('image'));

handler.post(async (req: NextApiRequest & ImgBuffer, res: NextApiResponse) => {
  const streamUpload = (req: NextApiRequest & ImgBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

export default handler;
