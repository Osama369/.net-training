import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, catchError, filter, map, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export  class BookmarkService {

  constructor(
    private authService : AuthService,
    private toastr : ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {


  }

  bookmarks: { item: string, link: any }[] = [];

  GetAllBookmarkScreens(){
    this.bookmarks = [];
    this.authService.GetAllBookmarkScreen().subscribe(x=>{
      if(x != null)
      {
        x.forEach((element:any) => {
          let item = element.Screens.screenName.trim();
          let link = element.Screens.descr;
          this.bookmarks.push({ item, link });
        });
      }
    })
  }


  addBookmark(item: string, link: any) {
    this.bookmarks.push({ item, link });
  }

  removeBookmark(item: string) {
    this.bookmarks = this.bookmarks.filter(b => b.item !== item);
  }

  Updatebookmark(screenName: any, value: any): Observable<boolean> {
    return this.authService.UpdateBookmarkScreen(screenName, value).pipe(
      map((result: any) => {
        if (value) {
          this.addBookmark(result[0].Screens.screenName, result[0].Screens.descr);
        } else {
          this.removeBookmark(result[0].Screens.screenName);
        }
        return value; // Return true if the operation was successful
      }),
      catchError((error: any) => {
        this.toastr.error(error.error);
        return throwError(false); // Throw an error if the operation failed
      })
    );
  }

  GetBookmarkScreen(screenName:any){
    this.authService.GetBookmarkScreen(screenName).subscribe(x=>{
      return x;
    });
    return false;
  }
}
