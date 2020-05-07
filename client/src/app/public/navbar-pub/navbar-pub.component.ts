import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-pub',
  templateUrl: './navbar-pub.component.html',
  styleUrls: ['./navbar-pub.component.css']
})
export class NavbarPubComponent implements OnInit {

  constructor(private route : Router) { }

  ngOnInit() {
  }

  login() {
    this.route.navigate(['/login']);
  }

  register() {
    this.route.navigate(['/register']);
  }

}
