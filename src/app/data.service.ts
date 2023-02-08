import { IDirecionamentoLiquidacaoTable } from './models/IDirecionamentoLiquidacao';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, retry } from 'rxjs';

import { API_PATH } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  private apiURL = API_PATH;
  private apiVersion = '';
  private direcionamentoLiquidacaoPath = '/direcionamento';

  getDirecionamentoLiquidacao(
    pageNumber: number,
    pageSize: number
  ): Observable<IDirecionamentoLiquidacaoTable> {
    let queryParam = '';
    queryParam += `/?_page=${pageNumber}`;
    queryParam += pageSize ? `&_limit=${pageSize}` : '';
    const url = `${this.apiURL}${this.apiVersion}${this.direcionamentoLiquidacaoPath}${queryParam}`;

    return this.http.get<IDirecionamentoLiquidacaoTable>(url).pipe(
      retry(3),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  updateDirecionamentoLiquidacao(conta_b3: string, status: boolean) {
    console.log('conta_b3: ' + conta_b3 + '\nstatus: ' + status);

    const url = `${this.apiURL}${this.apiVersion}${this.direcionamentoLiquidacaoPath}/${conta_b3}`;
    this.http.patch<any>(url, { direcionamento_liquidacao: status }).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
