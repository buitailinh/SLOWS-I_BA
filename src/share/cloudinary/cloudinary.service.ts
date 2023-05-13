import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
const DatauriParser = require("datauri/parser");
import path from 'path';
const parser = new DatauriParser()
@Injectable()
export class CloudinaryService {

  async uploadImage(file) {
    // console.log(file)
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    try {
      const upload = await cloudinary.uploader.upload(file64.content!);
      return upload.url;
    } catch (error) {
      console.error(error)
      throw new Error('Unable to create a post, please try again')
    }
  }

  async uploadImageData(data) {
    try {
      const imageUrl = await cloudinary.uploader.upload(data);
      return imageUrl.url;
    } catch (error) {
      console.error(error)
      throw new Error('Unable to create a post, please try again')
    }
  }

  async uploadImages(files) {
    try {
      files.forEach((file) => this.uploadImage(file));
    } catch (error) {
      throw new Error('Unable to create a post, please try again')
    }
  }


  async deleteImage(file) {
    try {
      const avatar = file.substring(file.lastIndexOf("/") + 1, file.lastIndexOf("."));;
      await cloudinary.uploader.destroy(avatar);
    } catch (error) {
      throw new Error('Unable to create a post, please try again')
    }
  }

  async deleteImages(files) {
    try {
      files.forEach((file) => this.deleteImage(file));
    } catch (error) {
      throw new Error('Unable to create a post, please try again')
    }
  }
}
