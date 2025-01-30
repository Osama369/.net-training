import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timezoneDate'
})
export class TimezoneDatePipe implements PipeTransform {
  transform(date: string, format: string): string {
    const utcDate = new Date(date); // Parse the input date string
    const utcDateString = utcDate.toISOString(); // Convert to UTC string

    const offset = this.getOffsetFromLocalStorage(); // Get offset from localStorage
    const localTimestamp = new Date(utcDateString).getTime() + (offset * 60 * 1000); // Add offset in milliseconds
    const localDate = new Date(localTimestamp).toISOString(); // Create a new Date object with local time

    var dt = new Date(localDate);

    // Get individual date components
    var year = dt.getUTCFullYear().toString(); // Get the year (UTC) as a string
    var month = (dt.getUTCMonth() + 1).toString().padStart(2, "0"); // Get the month (UTC) and pad with leading zero
    var day = dt.getUTCDate().toString().padStart(2, "0"); // Get the day of the month (UTC) and pad with leading zero
    var hours = dt.getUTCHours().toString().padStart(2, "0"); // Get the hours (UTC) and pad with leading zero
    var minutes = dt.getUTCMinutes().toString().padStart(2, "0"); // Get the minutes (UTC) and pad with leading zero
    var seconds = dt.getUTCSeconds().toString().padStart(2, "0"); // Get the seconds (UTC) and pad with leading zero

    // Format date using the desired format
    const timeZoneString = localStorage.getItem('timeZone');
    const timeZoneAbbr = timeZoneString ? timeZoneString.match(/\b([A-Z]{2,5})\b/) : '';
    const abbreviation = timeZoneAbbr ? timeZoneAbbr[0] : '';

    return day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds + " ("+abbreviation+")";

   // return localDate; // Format and return
  }


  private getOffsetFromLocalStorage(): number {
    const timeZoneString = localStorage.getItem('timeZone');
    if (timeZoneString) {
      // Extract offset from the timeZone string
      const offsetMatch = timeZoneString.match(/(-|\+)(\d{2}):(\d{2})/);
      if (offsetMatch) {
        const sign = offsetMatch[1] === '-' ? -1 : 1;
        const hours = parseInt(offsetMatch[2], 10);
        const minutes = parseInt(offsetMatch[3], 10);
        return sign * (hours * 60 + minutes);
      }
    }
    return 0; // Default to 0 if timeZone is not found in localStorage
  }
}
