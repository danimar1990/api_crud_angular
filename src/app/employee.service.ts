import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmployeeTable } from './models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  public getEmployees(
    pageNumber: Number,
    pageSize: Number
  ): Observable<EmployeeTable> {
    const url = `https://reqres.in/api/users?page=${pageNumber}&per_page=${pageSize}`;

    return this.http.get<EmployeeTable>(url);
  }
}
