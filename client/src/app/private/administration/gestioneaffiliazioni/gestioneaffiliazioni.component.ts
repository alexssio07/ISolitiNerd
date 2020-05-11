import { Component, OnInit, Input } from '@angular/core';
import { Affiliazione } from 'src/app/models/affiliazione';
import { ProfileComplete } from 'src/app/models/profileComplete';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gestioneaffiliazioni',
  templateUrl: './gestioneaffiliazioni.component.html',
  styleUrls: ['./gestioneaffiliazioni.component.css']
})
export class GestioneaffiliazioniComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  listaAffiliazioni: Affiliazione[] = [];
  listaProfiliUsers: ProfileComplete[] = [];
  currentAffiliazione: Affiliazione = { ID: 0, Richiesta: '', ID_Profile: 0};

  constructor(private usersService: UserService) { }

  ngOnInit() {
    this.getListaAffiliati();
  }


  getListaAffiliati() {
    this.usersService.getAffiliati().then(richieste => {
      this.listaAffiliazioni = JSON.parse(JSON.stringify(richieste));
      this.usersService.getProfileUsers().then(profili => {
        this.listaAffiliazioni.forEach(affiliazione => {
          var profiliUtenti = JSON.parse(JSON.stringify(profili));
          profiliUtenti.forEach(profiloUser => {
            if (affiliazione.ID_Profile == profiloUser.ID) {
              this.listaProfiliUsers.push(profiloUser);
            }
          });
        });
      });
    });
  }

  openAffiliazione(id) {
    this.listaAffiliazioni.forEach(affiliato => {
      if (affiliato.ID_Profile === id) {
        this.currentAffiliazione = affiliato;
      }
    });
  }

}
