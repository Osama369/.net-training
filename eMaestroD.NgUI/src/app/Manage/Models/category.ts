export interface Category {
  categoryID?: number;
  parentCategoryID?: number;
  parentCategoryName?: string;
  depID?: number;
  categoryName?: string;
  descr?: string;
  active?: boolean;
  crtBy?: string;
  crtDate?: Date;
  modby?: string;
  modDate?: Date;
  comID?: any;
  depName?:any;
}
