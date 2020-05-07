import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gestioneaffiliazioni',
  templateUrl: './gestioneaffiliazioni.component.html',
  styleUrls: ['./gestioneaffiliazioni.component.css']
})
export class GestioneaffiliazioniComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
