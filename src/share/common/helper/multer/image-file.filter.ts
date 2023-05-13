import { HttpException, HttpStatus } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";

export const imageFileFilter = (req, file, cb) => {
  if (!/^image\/.+$/.test(file.mimetype)) {
    req.fileValidationError = new Error('Not a Image File!');
    return cb(null, false);
  }
  cb(null, true);
};

export const multerOptions = {

  limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },

  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  filename: (req: any, file: any, cb: any) => {
    console.log(file);
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  },
};
