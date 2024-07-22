import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private logoPathSubject: BehaviorSubject<string> = new BehaviorSubject<string>("null");
  logoPath$: Observable<string> = this.logoPathSubject.asObservable();

  constructor() { }

  updateLogoPath(path: string): void {
    this.logoPathSubject.next(path);
  }
}
