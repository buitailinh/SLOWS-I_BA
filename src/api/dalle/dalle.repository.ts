import { MongoRepository } from 'typeorm';
import { Dalle } from './entities/dalle.entity';
import { Mongo2Repository } from 'src/share/database/mongodb2.repository';
import { Inject, Injectable } from "@nestjs/common";
import { DALLE_CONST } from './dalle.constant';


@Injectable()
export class DalleRepository extends Mongo2Repository<Dalle>{
  constructor(
    @Inject(DALLE_CONST.MODEL_PROVIDER)
    dalle: MongoRepository<Dalle>,
  ) {
    super(dalle);
  }
}
