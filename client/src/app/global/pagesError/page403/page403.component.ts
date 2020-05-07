import { Component, OnInit } from '@angular/core';
import { transition, trigger, state, style, animate } from '@angular/animations';

@Component({
  selector: 'app-page403',
  templateUrl: './page403.component.html',
  styleUrls: ['./page403.component.css'],
  animations: [
    trigger('1', [
      transition(':enter', [
        style({ transform: 'translateY(0px)' }),
        animate('2000ms', style({ transform: 'translateY(-40px)' })),
      ]),
      transition(':leave', [
        animate('3000ms', style({ transform: 'translateY(0px)' }))
      ])
    ])
  ]
})
export class Page403Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
