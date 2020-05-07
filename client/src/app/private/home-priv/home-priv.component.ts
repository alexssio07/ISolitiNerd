import { Component, OnInit } from '@angular/core';
import { ViewStreamerEnum } from 'src/app/global/enums/viewStreamerEnum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewStreamer } from 'src/app/models/viewStreamer';
import { UserAffiliato } from 'src/app/models/userAffiliato';

@Component({
  selector: 'app-home-priv',
  templateUrl: './home-priv.component.html',
  styleUrls: ['./home-priv.component.css']
})
export class HomePrivComponent implements OnInit {

  endpoint: string = 'http://localhost:5000/api';
  //headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  userAffiliato: UserAffiliato;
  listUsersAffiliati: UserAffiliato[] = [];
  viewStreamer: ViewStreamer = {
    classeContenitore: 'contenitoreColonne2', classeFiltroView: 'input-groupColonne2', classeRiquadriTwitch: [],
    tipoView: null, nicknameTwitch: [], src: [], href: []
  };
  viewStreamerSelected: ViewStreamerEnum = ViewStreamerEnum.RigaConDescrizione;

  viewsSelector: ViewStreamerEnum[] =
    [ViewStreamerEnum.Colonna1, ViewStreamerEnum.Colonna2, ViewStreamerEnum.ColonnaDaDueMiniature, ViewStreamerEnum.RigaConDescrizione];

  viewStreamerGroup: FormGroup;

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) { }

  ngOnInit() {
    //this.showStreamingOurChannel();
    this.viewStreamerGroup = this.fb.group({
      viewSelected: this.viewStreamerSelected
    });
  }

  showStreamingOurChannel() {
    this.http.get<any>('https://api.twitch.tv/kraken?client_id=g4lsbrd0lf4bkytfng5gafkuc93ash')
      .subscribe((res: any) => {
        console.log(res);
        console.log(JSON.stringify(res));
      });
  }

  getAffiliati() {
    this.userService.getUsers().then(users => {
      if (users !== undefined) {
        var listUser = JSON.parse(JSON.stringify(users));
        this.userService.getProfileUsers().then(profileUsers => {
          if (profileUsers !== undefined) {
            var listProfileUsers = JSON.parse(JSON.stringify(profileUsers));
            listProfileUsers.forEach(profileUser => {
              listUser.forEach(user => {
                if (profileUser.ID_User === user.ID) {
                  this.userAffiliato.giocoStream = "Prova";
                  this.userAffiliato.nicknameTwitch = profileUser.CanaleTwitch;
                  this.userAffiliato.nickname = user.Username;
                  this.userAffiliato.descrizione = profileUser.Descrizione;
                  this.userAffiliato.canaleYoutube = profileUser.CanaleYoutube;
                  this.userAffiliato.paginaFacebook = profileUser.PaginaFacebook;
                  this.userAffiliato.paginaInstagram = profileUser.PaginaInstagram;
                  this.userAffiliato.priorita = 1;
                  this.listUsersAffiliati.push(this.userAffiliato);
                }
              });
            });
          }
        });
      }
    });
  }

  setColonnaDaUno() {
    this.viewStreamer.tipoView = ViewStreamerEnum.Colonna1;
    this.viewStreamer.classeContenitore = 'contenitoreColonna1';
    this.viewStreamer.classeFiltroView = 'input-groupColonna1';
  }

  setColonneDaDue() {
    this.viewStreamer.tipoView = ViewStreamerEnum.Colonna2;
    this.viewStreamer.classeContenitore = 'contenitoreColonne2';
    this.viewStreamer.classeFiltroView = 'input-groupColonne2';
  }

  setRigheConDettaglio() {
    this.viewStreamer.tipoView = ViewStreamerEnum.RigaConDescrizione;
    this.viewStreamer.classeContenitore = 'contenitoreColonne2';
    this.viewStreamer.classeFiltroView = 'input-groupColonne2';
  }

  setColonnaDaDueMiniature() {
    this.viewStreamer.tipoView = ViewStreamerEnum.ColonnaDaDueMiniature;
    this.viewStreamer.classeContenitore = 'contenitoreRigaColonne';
    this.viewStreamer.classeFiltroView = 'input-groupRigaColonne';
  }

  setViewDescription() {
    if (this.viewStreamerSelected === ViewStreamerEnum.RigaConDescrizione) {
      return true;
    }
    return false;
  }

  setView(value) {
    this.viewStreamerSelected = value;
    console.log(this.viewStreamerSelected);
    switch (this.viewStreamerSelected) {
      case ViewStreamerEnum.Colonna1:
        this.setColonnaDaUno();
        break;
      case ViewStreamerEnum.Colonna2:
        this.setColonneDaDue();
        break;
      case ViewStreamerEnum.ColonnaDaDueMiniature:
        this.setColonnaDaDueMiniature();
        break;
      case ViewStreamerEnum.RigaConDescrizione:
        this.setRigheConDettaglio();
        break;
      default:
        this.setColonnaDaUno();
        break;
    }
  }
}
