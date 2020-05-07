import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

 

  constructor(public authenticateService : AuthenticationServiceService) { }

  ngOnInit() {
    
  }

}

