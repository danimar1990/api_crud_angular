import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { startWith, switchMap } from 'rxjs';

import { DataService } from './data.service';
import { IDirecionamentoLiquidacao } from './models/IDirecionamentoLiquidacao';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  displayedColumns: Array<string> = [
    'status',
    'carteira',
    'razao_social',
    'direcionamento_liquidacao',
  ];

  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];

  position = new FormControl(this.positionOptions[0]);

  dataSource = new MatTableDataSource<IDirecionamentoLiquidacao>();

  StatusOptions: any = [];
  RazaoOptions: any = [];

  selectedRazaoSocial: string = '';
  selectedStatus: string = '';
  filteredDataSource = new MatTableDataSource<IDirecionamentoLiquidacao>();

  isLoading: boolean = false;

  pageSizes = [10, 20, 30, 50, 100];
  totalData: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: DataService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconLiteral(
      'thumbs-up',
      sanitizer.bypassSecurityTrustHtml(INFO_ICON)
    );
  }

  ngAfterViewInit() {
    this.resetFilters();
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getDirecionamentoLiquidacao$(
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        })
      )
      .subscribe((res: any) => {
        res.forEach((res: any) => {
          if (res.direcionamento_liquidacao === true) {
            res.status = 'Habilitado';
          } else if (res.direcionamento_liquidacao === false) {
            res.status = 'Desabilitado';
          } else if (res.direcionamento_liquidacao === null) {
            res.status = 'Não se aplica';
          }
        });

        this.filteredDataSource.data = this.dataSource.data;
        this.filteredDataSource.paginator = this.paginator;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.RazaoOptions = _.uniq(res.map((item: any) => item.razao_social));
        this.StatusOptions = _.uniq(res.map((item: any) => item.status));
        this.isLoading = false;
        this.resetFilters();
      });
  }

  getDirecionamentoLiquidacao$(pageNumber: number, pageSize: number) {
    return this.service.getDirecionamentoLiquidacao(pageNumber, pageSize);
  }

  onFormSubmit(conta_b3: string, status: boolean) {
    this.service.updateDirecionamentoLiquidacao(conta_b3, status);
    this.ngAfterViewInit();
  }

  applyFilters() {
    this.filteredDataSource.data = this.dataSource.data.filter((data: any) => {
      return (
        (this.selectedRazaoSocial === '' ||
          data.razao_social === this.selectedRazaoSocial) &&
        (this.selectedStatus === '' || data.status === this.selectedStatus)
      );
    });

    this.filteredDataSource.paginator = this.paginator;
    this.totalData = this.filteredDataSource.data.length;
  }

  resetFilters() {
    this.selectedRazaoSocial = '';
    this.selectedStatus = '';
    this.filteredDataSource.data = this.dataSource.data;
    this.filteredDataSource.paginator = this.paginator;
    this.totalData = this.filteredDataSource.data.length;
  }
}

const INFO_ICON = `
<svg fill="#1e5ad2" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 416.979 416.979" xml:space="preserve" stroke="#1e5ad2">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <g> <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"/> </g> </g>

</svg>
`;
