import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
// import { uuid } from 'uuidv4';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uplFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

export default {
  tmpFolder,
  uplFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      // const fileHash = uuid();
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
