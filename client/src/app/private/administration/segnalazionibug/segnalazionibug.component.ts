import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-segnalazionibug',
  templateUrl: './segnalazionibug.component.html',
  styleUrls: ['./segnalazionibug.component.css']
})
export class SegnalazionibugComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
