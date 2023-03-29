import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  public driversList$ = new BehaviorSubject<Drivers[]>([]);
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  addDriver(driver: Drivers): Observable<HttpResponseObject<Drivers>> {
    const headers = this.getHeaders();
    return this.http
      .post<Drivers>(`${environment.baseUrl}/drivers`, driver, {
        headers: headers,
      })
      .pipe(
        map((data: Drivers) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: true,
            message: 'New Driver added successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data)
            this.driversList$.next([
              ...this.driversList$.getValue(),
              responseObject.data,
            ]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: false,
            message: `Unable to add new driver. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  editDriver(
    driver: Drivers,
    driverId?: string
  ): Observable<HttpResponseObject<Drivers>> {
    const headers = this.getHeaders();
    return this.http
      .patch<Drivers>(`${environment.baseUrl}/drivers/${driverId}`, driver, {
        headers: headers,
      })
      .pipe(
        map((data: Drivers) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: true,
            message: 'Driver edited successfuly',
            data: data,
            status: 200,
          };

          //updating the driversList$ with the new values
          if (responseObject.data) {
            const updatedList = this.driversList$.getValue().map((d) => {
              if (d.id === responseObject.data?.id) {
                return responseObject.data;
              }
              return d;
            });
            this.driversList$.next(updatedList as Drivers[]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: false,
            message: `Unable to edit driver. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  getAllDriversList(): Observable<HttpResponseObject<Drivers>[]> {
    return this.http.get<Drivers[]>(`${environment.baseUrl}/drivers`).pipe(
      map((data: Drivers[]) => {
        const responseObject: HttpResponseObject<Drivers>[] = data.map((d) => ({
          success: true,
          message: 'Driver retrieved successfully',
          data: d,
          status: 200,
        }));
        this.driversList$.next(data);
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting drivers list:', error);
        const responseObject: HttpResponseObject<Drivers>[] = [
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

  getDriversList(): Observable<HttpResponseObject<Drivers[]>> {
    return this.driversList$.asObservable().pipe(
      map((drivers: Drivers[]) => {
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
