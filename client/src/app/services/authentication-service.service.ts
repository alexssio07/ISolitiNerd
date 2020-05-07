import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, interval, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { StatusResponseTypes } from '../global/enums/statusResponseTypes';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  endpoint: string = 'http://localhost:5000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  username: string = "";
  formRegister = {
    user: {},
    token: {}
  }
  ruolo: String = "";
  loginAvvenutaConSuccesso: Boolean = false;
  constructor(private http: HttpClient, private cookieService: CookieService, private route: Router) { }

  getUsername(): any {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
  }

  getUsernameCookie(): any {
    return this.cookieService.get('userName');
  }
  setUsernameCookie(username, date) {
    this.setUsername(username);
    this.cookieService.set('userName', username, date);
  }

  register(currentUser: any) {
    let apiRegister = `${this.endpoint}/register`;
    return new Promise(resolve => {
      this.createToken(currentUser).then(token => {
        currentUser.token = token;
        console.log("form register: " + JSON.stringify(currentUser));
        this.http.post<any>(apiRegister, currentUser)
          .subscribe((resRegister: any) => {
            console.log("Creazione token..." + JSON.stringify(resRegister));
            if (resRegister.auth) {
              this.setTokenCookie(resRegister.token);
              var dataScadenza = new Date(resRegister.token.dataScadenza);
              console.log(dataScadenza);
              this.setUsernameCookie(currentUser.username, dataScadenza);
              resolve(resRegister);
            }
            else {
              resolve(resRegister);
            }
          });
      });
    });
  }

  createToken(username) {
    let apiToken = `${this.endpoint}/createToken`;
    return new Promise(resolve => {
      this.http.post<any>(apiToken, username)
        .subscribe((res: any) => {
          resolve(res.token);
        });
    })
  }

  login(user: User) {
    let apiToken = `${this.endpoint}/login`;
    var tokenValue = {
      token: {}, user: JSON.parse(JSON.stringify(user)).username
    }
    return new Promise(resolve => {
      this.http.post<any>(apiToken, user)
        .subscribe((res: any) => {
          var ruolo = "";
          console.log("Login Authentication");
          if (res.auth) {
            ruolo = res.ruolo.TipoRuolo;
            this.deleteCookieByUsername(tokenValue.user).then(deleteAuthentication => {
              if (deleteAuthentication) {
                this.createToken(user).then(value => {
                  if (value != undefined || value != "") {
                    var tokenCreated = JSON.parse(JSON.stringify(value));
                    var dataScadenza = new Date(tokenCreated.dataScadenza);
                    this.setTokenCookieDate(tokenCreated.key, dataScadenza);
                    this.setUsernameCookie(tokenValue.user, dataScadenza);
                    tokenValue.token = value;
                    this.http.post<any>(`${this.endpoint}/setToken`, tokenValue)
                      .subscribe((res: any) => {
                        console.log(res);
                        if (res != undefined) {
                          this.setLoginAvvenutaConSuccesso(true);
                          this.setRuolo(ruolo);
                          resolve(res.auth);
                        } else {
                          this.setLoginAvvenutaConSuccesso(false);
                          this.setRuolo("");
                        }
                      });
                  }
                });
              }
              else {
                this.setLoginAvvenutaConSuccesso(false);
                this.setRuolo("");
                resolve(false);
              }
            });
          }
          else {
            if (res.passwordError) {
              resolve(res);
            }
          }
        });
    });
  }

  isTokenExpired() {
    var valueLogout = StatusResponseTypes[StatusResponseTypes.logout].toString();
    var valueSessionExpired = StatusResponseTypes[StatusResponseTypes.sessionExpired].toString();
    var valueToken = {
      isValid: true,
      key: "",
    }
    return new Promise(resolve => {
      var tokenFromCookie = this.getTokenCookie();
      var username = this.getUsernameCookie();
      var request = {
        username: username,
        token: tokenFromCookie
      }
      if ((tokenFromCookie.length > 0 || tokenFromCookie != undefined) && (username.length > 0 || username != undefined)) {
        this.http.post<any>(`${this.endpoint}/getToken`, request)
          .subscribe((res: any) => {
            console.log(res);
            if (res != undefined) {
              if (res.tokenFound) {
                var tokenFromDB = res.token[0].Token;
                var dateTokenDB = new Date(res.token[0].DataScadenza);
                var dateNow = new Date();
                dateTokenDB.setHours(dateTokenDB.getHours() + (dateTokenDB.getHours() - dateTokenDB.getUTCHours()));
                if (dateTokenDB > dateNow) {
                  resolve(valueToken);
                }
                else {
                  valueToken.isValid = false;
                  valueToken.key = valueSessionExpired;
                  resolve(valueToken);
                }
              }
              else {
                valueToken.isValid = false;
                resolve(valueToken);
              }
            }
            else {
              valueToken.isValid = false;
              resolve(valueToken);
            }
          });
      } else {
        resolve(true);
      }
    });
  }

  logOut() {
    return new Promise(resolve => {
      this.deleteAuth().then(value => {
        resolve(value);
      });
    });
  }

  cleanCookie() {
    return new Promise(resolve => {
      if (this.cookieService.check('userName') || this.cookieService.check('token')) {
        this.cookieService.delete('token');
        this.cookieService.delete('userName');
      }
      resolve(true);
    });
  }

  getTokenCookie(): string {
    return this.cookieService.get('token');
  }

  setTokenCookie(token) {
    let expiresDate = new Date(token.dataScadenza);
    this.cookieService.set('token', token.key, expiresDate);
  }

  setTokenCookieDate(token, date) {
    this.cookieService.set('token', token, date);
  }

  setAuth(token: string, username: string) {
    return new Promise(resolve => {
      var dataScadenza = new Date();
      dataScadenza.setMinutes(dataScadenza.getMinutes() + 2);
      this.cookieService.set('token', token, dataScadenza);
      this.cookieService.set('userName', username, dataScadenza);
      console.log("Token scade: " + dataScadenza.toTimeString());
      resolve(dataScadenza.toTimeString());
    });
  }

  deleteCookieByUsername(username) {
    var request = {
      username: username
    };
    return new Promise(resolve => {
      if (request.username !== "" && request.username !== undefined) {
        this.http.post<any>(`${this.endpoint}/deleteToken`, request)
          .subscribe(dataDeletetoken => {
            resolve(true);
          }, error => {
            console.log(error);
            resolve(false);
          });
      }
      else {
        resolve(false);
      }
    });
  }

  deleteAuth() {
    var request = {
      username: this.cookieService.check('userName') === true ? this.getUsernameCookie() : this.getUsername()
    };
    console.log("request: " + JSON.stringify(request));
    return new Promise(resolve => {
      if (request.username !== "" && request.username !== undefined) {
        this.http.post<any>(`${this.endpoint}/deleteToken`, request)
          .subscribe(dataDeletetoken => {
            resolve(true);
          }, error => {
            console.log(error);
            resolve(false);
          });
      }
      else {
        resolve(false);
      }
    });
  }

  createKeyLogin(formMail) {
    let apiToken = `${this.endpoint}/createKeyLogin`;
    return new Promise(resolve => {
      this.http.post<any>(apiToken, formMail)
        .subscribe((res: any) => {
          console.log("Creazione key login...");
          console.log("key login: " + JSON.stringify(res));
          resolve(res);
        });
    });
  }

  getProfileUserByUsername() {
    var request = {
      username: ""
    };
    return new Promise(resolve => {
      let apiToken = `${this.endpoint}/getProfileUserByUsername`;
      var username = this.getUsernameCookie();
      if (username != "") {
        request.username = username;
        this.http.post<any>(apiToken, request)
          .subscribe((res: any) => {
            console.log("User Profile: " + JSON.stringify(res));
            resolve(res);
          });
      }
      else {
        resolve(false);
      }
    });
  }

  getProfileUserByID(id) {
    var request = {
      id: id
    };
    return new Promise(resolve => {
      let apiToken = `${this.endpoint}/getProfileUserById`;
      this.http.post<any>(apiToken, request)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  getAffiliazioni() {
    let apiToken = `${this.endpoint}/getAffiliazioni`;
    return new Promise(resolve => {
      this.http.get<any>(apiToken)
        .subscribe((res: any) => {
          resolve(res.affiliazioni);
        });
    });
  }

  setLoginAvvenutaConSuccesso(loginAvvenutaConSuccesso) {
    this.loginAvvenutaConSuccesso = loginAvvenutaConSuccesso;
  }
  getLoginAvvenutaConSuccesso() {
    return this.loginAvvenutaConSuccesso;
  }

  setRuolo(ruolo) {
    this.ruolo = ruolo;
  }

  getRuolo() {
    return this.ruolo;
  }
}
