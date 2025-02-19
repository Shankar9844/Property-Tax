import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = 'https://demo.seminalsoftwarepvt.in/eoasis17/api/';
                //  https://demo.seminalsoftwarepvt.in/eoasis17/api/kiosk/GetCityTitle
  constructor(private http: HttpClient) {}

  public config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  GetPersonalDetail(form: any): Observable<any> {
    const url = `${this.apiUrl}kiosk/GetSASTaxStatusDetails?PID=${form.pid}`;
    return this.http.get(url).pipe(
      catchError((error: any) => this.handleError(error))
    );
  }

  GetCityTitle():Observable<any>
  {
    return this.http.get(`${this.apiUrl}kiosk/GetCityTitle`).pipe( catchError((error: any) => this.handleError(error)));
  }

  handleError(error: any): any {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
