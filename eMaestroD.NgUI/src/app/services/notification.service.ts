import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationAlert } from '../models/notification-alert';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  baseApiUrl: string = environment.BaseApiUrl+'/Notification/';
  constructor(private http: HttpClient) { }

  SaveNotificationAlert(list:NotificationAlert): Observable<NotificationAlert[]> {
    return this.http.post<NotificationAlert[]>(this.baseApiUrl+'SaveNotificationAlert',list);
  }

  GetNotificationAlert(): Observable<NotificationAlert[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<NotificationAlert[]>(this.baseApiUrl+'GetNotificationAlert/'+comID);
  }

  DeleteNotificationAlert(notificationAlertID: any){
    return this.http.delete<any>(this.baseApiUrl+'DeleteNotificationAlert/'+notificationAlertID);
  }

  GetNotification(): Observable<NotificationAlert[]> {
    let comID = localStorage.getItem('comID');
    if(comID != null)
    {
      return this.http.get<NotificationAlert[]>(this.baseApiUrl+'GetNotification/'+comID);
    }
    return this.http.get<NotificationAlert[]>(this.baseApiUrl+'GetNotification/'+0);
  }

  UpdateNotificationStatus(notificationList:any){
    return this.http.post<any>(this.baseApiUrl+'UpdateNotificationStatus/',notificationList);
  }

}
