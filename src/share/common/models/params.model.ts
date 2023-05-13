import { PaginateCursorParams, PaginateParams } from './pagination';

export interface ParamCommonList {
  conditions: any;
  projections?: any;
  paginate?: PaginateParams;
  populate?: any;
}

export interface ParamCommonListCursor {
  conditions: any;
  projections?: any;
  paginateCursor?: PaginateCursorParams;
}

export interface ParamCommonDetailByIdAndPopulate {
  id: string;
  projections?: any;
  populate: any;
}

export interface ParamCommonDetailByConditionAndPopulate {
  conditions: any;
  projections?: any;
  populate: any;
}

