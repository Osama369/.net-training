import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  timezone: string = 'UTC';

  baseApiUrl: string = environment.BaseApiUrl;
  constructor(private http: HttpClient) { }

  // Method to convert date to the specified timezone
  convertToTimezone(date: Date): Date {

    // Implement your logic here to convert the date to the specified timezone
    // For example:

    this.getConfiguration().subscribe(result=>{
      let Timezone = result[0].timeZone;
      const regex = /^(.*?) \((-?\d{2}:?\d{2})\)(?: \((.*?)\))?$/;
      const match = Timezone.match(regex);

      if (match) {
        const timezoneName = match[1].trim();
        const offset = match[2];
        const abbreviation = match[3] ? match[3].trim() : ''; // Ensure abbreviation is defined

        const offsetParts = offset.split(':');
      const hours = parseInt(offsetParts[0], 10);
      const minutes = parseInt(offsetParts[1], 10);
      const offsetInMinutes = (hours * 60) + minutes;

      const newDate = new Date(date.getTime() + (offsetInMinutes * 60000)); // Convert to desired timezone
      console.log(newDate);
      return newDate;

      }
      return date; // Return the original date for now
    });
    return date; // Return the original date for now
  }

  getConfiguration(): Observable<any[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any[]>(this.baseApiUrl + '/Company/getOneCompanyDetail/'+comID);
  }

}
