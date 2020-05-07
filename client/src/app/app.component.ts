import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'i-soliti-nerd';
  usernameConnected = '';
  subscription: Subscription;

  constructor(private route: Router, public authenticateService: AuthenticationServiceService) {
    this.subscription = route.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !route.navigated;
      }
    });
  }

  ngOnInit() {
  }


  openFormLogin() {
    this.route.navigate(['/login']);
  }

  openFormRegister() {
    this.route.navigate(['/register']);
  }
}
