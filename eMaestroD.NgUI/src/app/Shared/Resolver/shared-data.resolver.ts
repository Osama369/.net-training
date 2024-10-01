import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from '../Services/shared-data.service';

@Injectable({
  providedIn: 'root',
})
export class SharedDataResolver implements Resolve<any> {
  constructor(private sharedDataService: SharedDataService) {}

  resolve(): Observable<any> {
    return this.sharedDataService.loadAllData(); // Simply load the data via service
  }
}
