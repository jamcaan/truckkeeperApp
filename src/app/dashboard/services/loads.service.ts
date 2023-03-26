import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { environment } from 'src/environments/environment';
import { Loads } from '../models/loads.model';

@Injectable({
  providedIn: 'root',
})
export class LoadsService {
  public loadsList$ = new BehaviorSubject<Loads[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  addLoad(loads: Loads): Observable<HttpResponseObject<Loads>> {
    const headers = this.getHeaders();
    return this.http
      .post<Loads>(`${environment.baseUrl}/loads`, loads, {
        headers: headers,
      })
      .pipe(
        map((data: Loads) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: true,
            message: 'New Load added successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data)
            this.loadsList$.next([
              ...this.loadsList$.getValue(),
              responseObject.data,
            ]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: false,
            message: `Unable to add new load. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  getLoadsByDriver(driverId: string): Observable<HttpResponseObject<Loads>[]> {
    this.http
      .get<Loads[]>(`${environment.baseUrl}/drivers/${driverId}/loads`)
      .subscribe({
        next: (data: Loads[]) => {
          this.loadsList$.next(data);
        },
        error: (err) => {
          console.log('Error occurred while getting drivers list:', err);
        },
        complete: () => {},
      });
    return this.loadsList$.asObservable().pipe(
      map((data: Loads[]) => {
        const responseObject: HttpResponseObject<Loads>[] = data.map((d) => ({
          success: true,
          message: 'Driver retrieved successfully',
          data: d,
          status: 200,
        }));
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting drivers list:', error);
        const responseObject: HttpResponseObject<Loads>[] = [
          {
            success: false,
            message: `Unable to retrieve drivers. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  getLoadsList(): Observable<HttpResponseObject<Loads[]>> {
    return this.loadsList$.asObservable().pipe(
      map((drivers: Loads[]) => {
        return {
          success: true,
          message: 'Drivers retrieved successfully',
          data: drivers,
          status: 200,
        };
      })
    );
  }
}
