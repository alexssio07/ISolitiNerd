import { Component, OnInit, Pipe, SecurityContext } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { ProfileUser } from 'src/app/models/profile_user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewStreamerEnum } from 'src/app/global/enums/viewStreamerEnum';
import { ViewStreamer } from 'src/app/models/viewStreamer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-affiliazioni',
  templateUrl: './affiliazioni.component.html',
  styleUrls: ['./affiliazioni.component.css']
})
export class AffiliazioniComponent implements OnInit {

  isAuthenticated: boolean = false;
  currentUserProfile: ProfileUser;
  affiliazioneForm: FormGroup;
  viewStreamerGroup: FormGroup;
  affiliatiArray: ProfileUser[] = [];
  areEmpty: boolean = true;

  viewStreamerSelected: ViewStreamerEnum = ViewStreamerEnum.Colonna1;
  viewsSelector: ViewStreamerEnum[] =
    [ViewStreamerEnum.Colonna1, ViewStreamerEnum.Colonna2, ViewStreamerEnum.ColonnaDaDueMiniature, ViewStreamerEnum.RigaConDescrizione];

  viewStreamer: ViewStreamer = {
    classeContenitore: '', classeFiltroView: '', classeRiquadriTwitch: [],
    tipoView: null, nicknameTwitch: [], src: [], href: []
  };

  src: string = "https://player.twitch.tv/?channel=userNickname";
  href: string = "https://www.twitch.tv/userNickname?tt_content=text_link&tt_medium=live_embed";
  safeUrl: SafeResourceUrl;

  constructor(public authenticateService: AuthenticationServiceService, private form: FormBuilder, private sanitizer: DomSanitizer) {
    this.affiliazioneForm = this.form.group({
      pageFacebook: [''],
      profileSteam: [''],
      profileInstagram: [''],
      youtubeChannel: [''],
      twitchChannel: [''],
      name: [''],
      nickname: ['']
    });
    this.viewStreamerGroup = this.form.group({
      viewSelected: this.viewStreamerSelected
    });
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    this.checkIsAuthenticated();
    this.getProfileUser();
    this.getAffiliazioni().then(value => {
      this.setView(this.viewStreamerSelected);
    })
  }

  checkIsAuthenticated() {
    if (this.authenticateService.getUsernameCookie() != "") {
      this.isAuthenticated = true;
    }
    else {
      this.isAuthenticated = false;
    }
  }

  getProfileUser() {
    this.authenticateService.getProfileUserByUsername().then(value => {
      if (value !== undefined && value !== false) {
        console.log(value);
        this.currentUserProfile = JSON.parse(JSON.stringify(value)).profileUser[0];
        this.setFormAffiliazione(this.currentUserProfile);
      }
    });
  }

  setFormAffiliazione(profileUser: any) {
    this.affiliazioneForm.value.pageFacebook = profileUser.PaginaFacebook;
    this.affiliazioneForm.value.profileSteam = profileUser.ProfiloSteam;
    this.affiliazioneForm.value.profileInstagram = profileUser.ProfiloInstagram;
    this.affiliazioneForm.value.youtubeChannel = profileUser.CanaleYoutube;
    this.affiliazioneForm.value.twitchChannel = profileUser.CanaleTwitch;
  }

  getAffiliazioni() {
    return new Promise(resolve => {
      this.authenticateService.getAffiliazioni().then(value => {
        var affiliaz = JSON.parse(JSON.stringify(value));
        if (affiliaz.length > 0 && affiliaz != undefined) {
          this.areEmpty = false;
          for (let index = 0; index < affiliaz.length; index++) {
            var affiliato = affiliaz[index];
            this.authenticateService.getProfileUserByID(affiliato.ID_Profile).then(value => {
              this.affiliatiArray.push(JSON.parse(JSON.stringify(value)).profileUser[0]);
              // TO DO Sarà da modificare
              this.viewStreamer.src.push(this.getSrcSafe(this.src.split("userNickname").join(JSON.parse(JSON.stringify(value)).profileUser[0].Nome)));
              this.viewStreamer.href.push(this.getHrefSafe(this.href.split("userNickname").join(JSON.parse(JSON.stringify(value)).profileUser[0].Nome)));
              this.viewStreamer.nicknameTwitch.push(JSON.parse(JSON.stringify(value)).profileUser[0].Nome);
              this.viewStreamer.classeRiquadriTwitch.push("canaleTwitch");
            });
          }
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  getSrcSafe(url: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getHrefSafe(url: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
        //this.setColonnaDaDueMiniature();
        break;
      case ViewStreamerEnum.RigaConDescrizione:
        this.setColonneDaDue();
        break;
      default:
        this.setColonnaDaUno();
        break;
    }
  }

  setRigheConDettaglio() {
    // this.viewStreamer.tipoView = ViewStreamerEnum.RigaConDescrizione;
    // this.viewStreamer.classeContenitore = 'contenitoreColonne2';
    // this.viewStreamer.classeFiltroView = 'input-groupColonne2';
  }

  setColonnaDaDueMiniature() {
    this.viewStreamer.tipoView = ViewStreamerEnum.ColonnaDaDueMiniature;
    this.viewStreamer.classeContenitore = 'contenitoreRigaColonne';
    this.viewStreamer.classeRiquadriTwitch = [];
    this.viewStreamer.nicknameTwitch.forEach(streamer => {
      this.viewStreamer.classeRiquadriTwitch.push('canaleTwitch');
    });
  }

  setColonneDaDue() {
    this.viewStreamer.tipoView = ViewStreamerEnum.Colonna2;
    this.viewStreamer.classeContenitore = 'contenitore-2-2colonne';
    this.viewStreamer.classeRiquadriTwitch = [];
    this.viewStreamer.nicknameTwitch.forEach(streamer => {
      this.viewStreamer.classeRiquadriTwitch.push('canaleTwitch');
    });
  }

  setColonnaDaUno() {
    this.viewStreamer.tipoView = ViewStreamerEnum.Colonna1;
    this.viewStreamer.classeContenitore = 'contenitore-2-colonna';
    this.viewStreamer.classeRiquadriTwitch = [];
    // TODO Da fare meglio
    this.viewStreamer.nicknameTwitch.forEach(element => {
      this.viewStreamer.classeRiquadriTwitch.push('canaleTwitch'); 
    });
    console.log(this.viewStreamer);
  }
}
