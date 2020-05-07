import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationServiceService } from '../services/authentication-service.service';
import { StatusResponseTypes } from '../global/enums/statusResponseTypes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationServiceService) { }

  nonAutorizzato = true;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      if (this.authService.getLoginAvvenutaConSuccesso()) {
        this.authService.isTokenExpired().then(value => {
          var valueTypeToken = JSON.parse(JSON.stringify(value)).key;
          var tokenIsValid = JSON.parse(JSON.stringify(value)).isValid;
          if (tokenIsValid) {
            let listaRuoli = next.data["ruoli"] as Array<String>;
            if (listaRuoli == undefined || listaRuoli == undefined) {
              this.nonAutorizzato = true;
            } else {
              let ruoloUtente = this.authService.getRuolo();
              for (let i = 0; i < listaRuoli.length; i++) {
                if (ruoloUtente == listaRuoli[i]) {
                  this.nonAutorizzato = false;
                  break;
                } else {
                  this.nonAutorizzato = true;
                }
              }
            }
            if (!this.nonAutorizzato) {
              return resolve(true);
            } else {
              this.router.navigate(['unathorized']);
              return resolve(false);
            }
          }
          else {
            if (valueTypeToken === StatusResponseTypes[StatusResponseTypes.sessionExpired]) {
              this.authService.cleanCookie().then(value => {
                if (value) {
                  this.router.navigate(['/homepublic']);
                  return resolve(true);
                }
                else {
                  this.router.navigate(['/servererror']);
                  return resolve(false);
                }

              });
              // ISCRIZIONE all'evento alerts sessione scaduta
            }
          }
        });
      }
      else {
        this.router.navigate(['/unathorized']);
        return resolve(false);
      }
    });
  }
}
