import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';
// import { uuid } from 'uuidv4';

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uplFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uplFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uplFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        // const fileHash = uuid();
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber-2',
    },
  },
} as IUploadConfig;
