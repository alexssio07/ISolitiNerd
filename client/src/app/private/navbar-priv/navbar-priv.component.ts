import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-priv',
  templateUrl: './navbar-priv.component.html',
  styleUrls: ['./navbar-priv.component.css']
})
export class NavbarPrivComponent implements OnInit {

  usernameConnected :string = "";

  constructor(private route: Router, private authenticateService : AuthenticationServiceService) { }

  ngOnInit() {
    if (this.authenticateService.getUsernameCookie() !== '' && this.authenticateService.getUsernameCookie() !== undefined) {
      this.usernameConnected = this.authenticateService.getUsernameCookie();
    }
  }

  logOut() {
    this.authenticateService.logOut().then(value => {
      if (value) {
        this.route.navigate(['/homepublica']);
      }
    });
  }
}
