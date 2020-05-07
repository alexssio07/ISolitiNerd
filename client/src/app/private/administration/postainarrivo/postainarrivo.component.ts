import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-postainarrivo',
  templateUrl: './postainarrivo.component.html',
  styleUrls: ['./postainarrivo.component.css']
})
export class PostainarrivoComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
