import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { resolve } from 'path';
import { SharedDataService } from '../Services/shared-data.service';
import {  ProductService  } from '../../Manage/Services/product.service';
import { SupplierService } from '../../Manage/Services/supplier.service';
import { FileUploadService } from '../../Manage/Services/file-upload.service';
export class sharedResolverResolver implements Resolve<any>{

  constructor(private sharedService:SharedDataService 
  ){}

  async resolve():Promise<any> {
    return await this.sharedService.loadAllData();
  }

}
