import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Email } from 'src/app/models/email';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  endpoint: string = 'http://localhost:5000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private route: Router) { }

  sendMailValidation(email: Email) {
    return new Promise(resolve => {
      this.http.post<any>(`${this.endpoint}/sendMail`, email)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }
  sendMailFromUser(email: Email) {
    return new Promise(resolve => {
      this.http.post<any>(`${this.endpoint}/sendMail`, email)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

}
