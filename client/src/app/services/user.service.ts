import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private route: Router) { }

  endpoint: string = "http://localhost:5000/api";


  getUsers() {
    let apiUsers = `${this.endpoint}/getUsers`;
    return new Promise(resolve => {
      this.http.get<any>(apiUsers)
        .subscribe((res: any) => {
          if (res.users.length > 0) {
            resolve(res.users);
          }
        });
    });
  }

  getUsersBanned() {
    let apiUsersBanned = `${this.endpoint}/getUsersBanned`;
    return new Promise(resolve => {
      this.http.get<any>(apiUsersBanned)
        .subscribe((res: any) => {
          if (res.usersBanned.length > 0) {
            resolve(res.usersBanned);
          }
        });
    });
  }

  getProfileUsers() {
    let apiProfile = `${this.endpoint}/getProfileUsers`;
    return new Promise(resolve => {
      this.http.get<any>(apiProfile)
        .subscribe((res: any) => {
          if (res.profileUsers.length > 0) {
            resolve(res.profileUsers);
          }
        });
    });
  }

}
