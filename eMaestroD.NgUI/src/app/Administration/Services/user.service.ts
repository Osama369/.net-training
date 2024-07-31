import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Users } from '../Models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseApiUrl: string = environment.BaseApiUrl + '/user/';

  constructor(private http: HttpClient) { }

  saveUser(list: Users[]): Observable<Users[]> {
    return this.http.post<Users[]>(this.baseApiUrl+'saveUser', list);
  }

  saveUserInMaster(list: Users): Observable<Users[]> {
    return this.http.post<Users[]>(this.baseApiUrl+'saveUserInMaster', list);
  }

  getAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.baseApiUrl+'getAllUsers');
  }

  deleteUser(userID:any) {
    return this.http.delete<any>(this.baseApiUrl+'deleteUser/'+userID);
  }

  ResetPassword(list:Users) {
    return this.http.post<Users>(this.baseApiUrl+'ResetPassword/',list);
  }

  ChangePassword(list:Users) {
    return this.http.post<Users>(this.baseApiUrl+'ChangePassword/',list);
  }

}
