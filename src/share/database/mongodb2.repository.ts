import { Model, SortOrder } from 'mongoose';
import { BaseEntity, DeepPartial, MongoRepository, ObjectID } from 'typeorm';
export class Mongo2Repository<T extends BaseEntity> {
  public repository: MongoRepository<T>;

  constructor(repository: MongoRepository<T>) {
    this.repository = repository;
  }


  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }
  save(data: any): Promise<T> {
    return this.repository.save(data);
  }

  update(id: ObjectID | string | number | string[] | Date | number[] | Date[], data: any): Promise<any> {
    return this.repository.update(id, data);
  }

  delete(id: ObjectID | string | number | string[] | Date | number[] | Date[]): Promise<any> {
    return this.repository.delete(id);
  }

  async findOneByCondition(conditions: any): Promise<T> {
    return this.repository.findOne(conditions);
  }

  async findOne(id: any): Promise<T | undefined> {
    return this.repository.findOne(id);
  }

  async find(): Promise<any> {
    return this.repository.find();
  }

  async findAndOptions(data: any): Promise<any> {
    return this.repository.findAndCount(data);
  }

  async paginateResponse(data, page, limit) {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      statusCode: 'success',
      data: [...result],
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    }
  };
}
