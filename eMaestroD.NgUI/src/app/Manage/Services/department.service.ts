import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../Models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }
  baseApiUrl: string = environment.BaseApiUrl + '/Departments/';
  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Department[]>(this.baseApiUrl+"GetAllDepartments/"+comID);
  }

  // Get a department by ID
  getDepartment(depID: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseApiUrl}/${depID}`);
  }

  upsertDepartment(department: Department): Observable<Department> {
    let comID = localStorage.getItem('comID');
    department.comID = comID;
    return this.http.post<Department>(this.baseApiUrl, department);
  }

  // Delete a department
  deleteDepartment(depID: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}${depID}`);
  }
}
