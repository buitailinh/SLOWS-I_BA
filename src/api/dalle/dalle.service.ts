import { ERROR } from 'src/share/common/error-code.const';
import { Dalle } from './entities/dalle.entity';
import { CloudinaryService } from './../../share/cloudinary/cloudinary.service';
import { UserService } from 'src/api/user/user.service';
import { DalleRepository } from './dalle.repository';
import { User } from 'src/api/user/user.entity';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDalleDto } from './dto/create-dalle.dto';
import { UpdateDalleDto } from './dto/update-dalle.dto';
import { openai } from 'src/configs/openAi.config';
import { FindDalleDto } from './dto/find-photo.dto';

@Injectable()
export class DalleService {
  constructor(
    public dalleRopository: DalleRepository,
    private userService: UserService,
    private cloudinary: CloudinaryService
  ) { }



  async findPhoto(findDallePhoto: FindDalleDto) {
    try {
      const { prompt, numb } = findDallePhoto;
      const aiResponse = await openai.createImage({
        prompt,
        n: numb,
        size: '1024x1024',
        response_format: 'b64_json',
      });

      // const image = aiResponse.data.data[0].b64_json;
      let image = aiResponse.data.data.map((data) =>
        data.b64_json
      );
      return { photos: image }
    } catch (error) {
      console.error(error);
    }

  }

  async getAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword || ''
    let order = null;
    if (query.order === 'ascend') {
      order = 1;
    } else if (query.order === 'descend') {
      order = -1;
    }
    const dalles = await this.dalleRopository.findAndOptions({
      where: keyword ? { prompt: { $regex: keyword, $options: 'i' } } : null,
      order: order ? { prompt: order } : null,    //=== 'descend' ? 'DESC' : 'ASC'
      take: take,
      skip: skip
    });

    dalles[0] = await Promise.all(dalles[0].map(async (dalle) => {
      dalle.user = await this.userService.getByUserId(dalle.user);

      return dalle;
    }));
    return this.dalleRopository.paginateResponse(dalles, page, skip);
  }

  async getDalleById(_id): Promise<Dalle> {
    const dalle = await this.dalleRopository.findOne(_id);
    if (!dalle)
      throw new NotFoundException(ERROR.DALL_NOT_FOUND.MESSAGE);
    return dalle;
  }

  async getDalleByUser(userId) {
    const userFound = await this.userService.getByUserId(userId);

    const listDalle = await this.dalleRopository.findAndOptions({
      where: { 'user': userFound._id, },
      order: { createAt: 'DESC' }

    });

    console.log(listDalle)

    return listDalle;
  }


  async create(createDalle: CreateDalleDto, user: User, file: Express.Multer.File) {

    const { prompt, isShare } = createDalle;

    const userFound = await this.userService.getByUserId(user._id);
    if (!userFound)
      throw new HttpException('User does not exists!', HttpStatus.BAD_REQUEST);
    const photoUrl = await this.cloudinary.uploadImage(file);
    const dalle = {
      prompt,
      photos: [photoUrl],
      isShare: isShare ? true : false,
      user: userFound._id,

    }
    // this.dalleRopository.save(dalle);
    return this.dalleRopository.save(dalle);
  }


  async update(dalleId, userId, updateDalle: UpdateDalleDto) {
    const { prompt, photos } = updateDalle;

    const dalleFound = await this.getDalleById(dalleId);
    if (dalleFound.user._id != userId) {
      throw new HttpException('You do not have access', HttpStatus.BAD_REQUEST);
    }

    await this.dalleRopository.update(dalleId, {
      ...dalleFound,
      prompt,
      photos
    });

    return {
      message: 'Updated dalle successfully!',
      status: 202
    }
  }

  async delete(dalleId) {
    const dallFound = await this.getDalleById(dalleId);
    await this.cloudinary.deleteImages(dallFound.photos);
    await this.dalleRopository.delete(dalleId);

    return {
      mesage: 'Delete dalle successfully',
    }
  }

}
