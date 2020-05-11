import { Component, OnInit, Input } from '@angular/core';
import { MenuAmministrationEnum } from '../../../global/enums/menuAmministrationEnum';

@Component({
  selector: 'app-navbar-amministration',
  templateUrl: './navbar-amministration.component.html',
  styleUrls: ['./navbar-amministration.component.css']
})
export class NavbarAmministrationComponent implements OnInit {
  
  @Input('isOpen') isOpen : boolean;
  
  openDashBoard: boolean = false;
  openBlog: boolean = false;
  openUsers: boolean = false;
  openAffiliazioni: boolean = false;
  openBug: boolean = false;
  openPostaInArrivo: boolean = false;
  menuDashboard = [];
  elementMenuDashboard: MenuAmministrationEnum;

  constructor() { }

  ngOnInit() {
    this.menuDashboard = [{ key: MenuAmministrationEnum.dashboard, open: true },
    { key: MenuAmministrationEnum.blog, open: false },
    { key: MenuAmministrationEnum.users, open: false },
    { key: MenuAmministrationEnum.affiliazioni, open: false },
    { key: MenuAmministrationEnum.bug, open: false },
    { key: MenuAmministrationEnum.postainarrivo, open: false }];

  }

  openMenu(value) {
    for (let index = 0; index < this.menuDashboard.length; index++) {
      const element = this.menuDashboard[index];
      if (element.key === value){
        this.menuDashboard[index].open = true;
      }
      else{
        this.menuDashboard[index].open = false;
      }
    }
  }


}
