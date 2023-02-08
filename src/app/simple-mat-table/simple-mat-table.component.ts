import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-simple-mat-table',
  templateUrl: './simple-mat-table.component.html',
  styleUrls: ['./simple-mat-table.component.css'],
})
export class SimpleMatTableComponent {
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'email',
    'avatar',
  ];

  totalData: number;

  dataSource = new MatTableDataSource<Employee>();

  isLoading = false;

  pageSizes = [3, 5, 7];

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(public empService: EmployeeService) {}

  ngAfterViewInit() {
    // debugger;
    this.dataSource.paginator = this.paginator;

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getTableData$(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((empData) => {
          if (empData == null) return [];
          this.totalData = empData.total;
          return empData.data;
        })
      )
      .subscribe((empData) => {
        this.dataSource = new MatTableDataSource(empData);
        this.isLoading = false;
      });
  }

  getTableData$(pageNumber: Number, pageSize: Number) {
    return this.empService.getEmployees(pageNumber, pageSize);
  }
}
