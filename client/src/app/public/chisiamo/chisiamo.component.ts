import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';

@Component({
  selector: 'app-chisiamo',
  templateUrl: './chisiamo.component.html',
  styleUrls: ['./chisiamo.component.css']
})
export class ChisiamoComponent implements OnInit {

  isAuthenticated : boolean = false;
  constructor(public authenticateService : AuthenticationServiceService) { }

  ngOnInit() {
    this.checkIsAuthenticated();
  }

  checkIsAuthenticated() {
    if (this.authenticateService.getUsernameCookie() !== '' && this.authenticateService.getUsernameCookie() !== undefined){
      this.isAuthenticated = true;
    }
    else {
      this.isAuthenticated = false;
    }
  }

}
