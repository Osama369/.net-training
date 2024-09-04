import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseApiUrl: string = environment.BaseApiUrl + '/Category';

  constructor(private http: HttpClient) { }

  // Get all categories filtered by comID
  getAllCategories(): Observable<Category[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Category[]>(`${this.baseApiUrl}/GetAllWithComID?comID=${comID}`);
  }

  // Get a category by depID and comID
  getCategory(depID: number): Observable<Category> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Category>(`${this.baseApiUrl}/GetByDepIDAndComID?depID=${depID}&comID=${comID}`);
  }

  // Add a new category
  UpsertCategory(category: Category): Observable<Category> {
    let comID = localStorage.getItem('comID');
    category.comID = comID;
    return this.http.post<Category>(this.baseApiUrl, category);
  }


  // Delete a category
  deleteCategory(categoryID: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/${categoryID}`);
  }
}
