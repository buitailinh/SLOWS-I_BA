import { Model, SortOrder } from 'mongoose';

export class MongooseRepository {
  public TSchema: Model<any>;

  constructor(_TSchema: Model<any>) {
    this.TSchema = _TSchema;
  }

  async create(params: unknown) {
    try {
      return this.TSchema.create(params);
    } catch (error) {
      throw new Error('Record created failed');
    }
  }

  save(param) {
    return new this.TSchema(param).save();
  }

  find() {
    return this.TSchema.find().exec();
  }

  async detailById(id: string, projections?: any) {
    return this.TSchema.findById(id, projections || {}).exec();
  }

  async detailByCondition(conditions: any, projections?: any) {
    return this.TSchema.findOne(conditions, projections || {}).exec();
  }

  async detailByConditionLean(conditions: any, projections?: any) {
    return this.TSchema.findOne(conditions, projections || {})
      .lean()
      .exec();
  }

  // async deleteOne(conditions: any) {
  //   return this.TSchema.deleteOne(conditions).exec();
  // }

  // async deleteMany(conditions: any) {
  //   return this.TSchema.deleteMany(conditions).exec();
  // }

  async findByIdAndDelete(id: string) {
    return this.TSchema.findByIdAndDelete(id).exec();
  }

  public async findByCondition(condition: object, projections?: any) {
    return this.TSchema.findOne(Object.assign(condition), projections || {}).exec();
  }

  async findOneAndDelete(conditions: any) {
    return this.TSchema.findOneAndDelete(conditions).exec();
  }

  async countByCondition(conditions: any) {
    return this.TSchema.countDocuments(Object.assign(conditions));
  }

  async aggregate(conditions: Array<any>) {
    return this.TSchema.aggregate(conditions);
  }

  findByConditionDistinct(condition: object) {
    return this.TSchema.find(condition).distinct('_id').exec();
  }

  findByConditionPaginateAndSort(
    condition: object,
    page: number,
    limit: number,
    sortKey?: string,
    sortOrder?: SortOrder,
  ) {
    return this.TSchema.find(condition)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ sortKey: sortOrder })
      .exec();
  }

  /**
   * @description find by id and select fields of record
   * @param userId {string}
   * @param fields {string} - list of fields to select
   */
  findByIdAndSelectFields(userId: string, fields?: string) {
    return this.TSchema.findById(userId).select(fields).exec();
  }

  /**
   * @description find by id and select fields of record
   * @param userId {string}
   * @param fields {string} - list of fields to select
   */
  findByConditionAndSelectFields(condition: object, fields?: string) {
    return this.TSchema.findOne(condition).select(fields).exec();
  }

  // getUserById(id: string) {
  //   return this.TSchema.findById(id).select('fullName email address phoneNumber isVerified').exec();
  // }

  // findOneByCondition(condition: object) {
  //   return this.TSchema.findOne(condition).exec();
  // }

  // /**
  //  * @description Find one and delete fieldProtect
  //  */
  // findOneByConditionAndProtectField(condition: object, fieldProtect: string) {
  //   return this.TSchema.findOne(condition).select(`-${fieldProtect}`).exec();
  // }

  findOneByIdAndUpdate(id: string, dataUpdate: object) {
    return this.TSchema.findByIdAndUpdate(id, { $set: dataUpdate }, { new: true }).exec();
  }

  findOneByConditionAndUpdate(condition: object, dataUpdate: object) {
    return this.TSchema.findOneAndUpdate(condition, { $set: dataUpdate }, { new: true }).exec();
  }

  // findOneByIdAndDelete(id: string, session?: any) {
  //   return session ? this.TSchema.findByIdAndDelete(id).exec() : this.TSchema.findByIdAndDelete(id).session(session);
  // }

  findManyByCondition(condition: object) {
    return this.TSchema.find(condition).exec();
  }

  // findById(id: string) {
  //   return this.TSchema.findById(id).exec();
  // }

  findByIdPopulate(id: string, populateValue: string) {
    return this.TSchema.findById(id).populate(populateValue).exec();
  }
}
