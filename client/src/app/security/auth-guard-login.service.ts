import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationServiceService } from '../services/authentication-service.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginService {

  constructor(private router: Router, private authService: AuthenticationServiceService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.authService.cleanCookie().then(value => {
        resolve(JSON.parse(JSON.stringify(value)));
      });
    });
  }
}
