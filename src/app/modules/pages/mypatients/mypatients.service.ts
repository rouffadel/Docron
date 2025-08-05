import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class MyPatientsService {
    private messageSource = new BehaviorSubject<any>(1);
    currentMessage = this.messageSource.asObservable();
    private API_URL: any = environment.API_URL;
    constructor(private http: HttpClient) {}

    GetAppointment(appointmentID): Observable<any> {
        return this.http
            .get<any>(
                this.API_URL +
                    'PatientsAppointments/GetAppointment/' +
                    appointmentID
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

    GetAllAppointments(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'PatientsAppointments/GetAllAppointments/')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    GetAllAppointments_Distict(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'PatientsAppointments/GetAllAppointments_Distict/')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    GetAllPatients(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Patients/GetAllPatients/')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

   
    getDoctors(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Doctor/GetAllDoctors/').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getServices(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Services').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getStatus(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Status').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }

    signIn(credentials: { name: string; password: string }): Observable<any> {
        return this.http
            .post<any>(this.API_URL + 'Login/UserExist', credentials)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

    //Global Method to Post data
    PostData(PostParam) {
        //debugger
        return new Promise((resolve, reject) => {
            var url =
                this.API_URL + 'PatientsAppointments/AddUpdateAppointments/';
            this.http.post(url, PostParam).subscribe(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }
}
