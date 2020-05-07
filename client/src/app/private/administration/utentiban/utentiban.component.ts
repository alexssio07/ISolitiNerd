import { Component, OnInit, Input } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { ProfileUser } from 'src/app/models/profile_user';
import { UserService } from 'src/app/services/user.service';
import { UsersBanned } from 'src/app/models/usersBanned';
import { ProfileComplete } from 'src/app/models/profileComplete';

@Component({
  selector: 'app-utentiban',
  templateUrl: './utentiban.component.html',
  styleUrls: ['./utentiban.component.css']
})
export class UtentibanComponent implements OnInit {

  @Input('isOpen') isOpen: boolean;

  users: User[] = [];
  profileUsers: ProfileUser[] = [];
  usersBanned: UsersBanned[] = [];
  usersProfileComplete: ProfileComplete[] = [];
  userProfileComplete: ProfileComplete;
  endpoint: string = 'http://localhost:5000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().then(value => {
      var values : any = value;
      this.users = values;
      this.userService.getProfileUsers().then(valueProfile => {
        var valuesProfiles : any = valueProfile;
        this.profileUsers = valuesProfiles;
        this.setProfileUser();
        console.log(this.users);
        // this.userService.getUsersBanned().then(valueUsersBanned => {
        //   var valuesUsersBanned : any = valueUsersBanned;
        //   if (!valueUsersBanned){
        //     console.log("0 Utenti bannati");
        //   }
        //   else {
        //     this.usersBanned = valuesUsersBanned;
        //     console.log("utenti bannati: " + this.usersBanned);
        //   }

        // })
      })
    });
  }

  setProfileUser() {
    for (let index = 0; index < this.users.length; index++) {
      var user = this.users[index];
      for (let index = 0; index < this.profileUsers.length; index++) {
        var profile = this.profileUsers[index];
        if (user.ID === profile.ID_User) {
          this.profileUsers[index].User = user;
          this.userProfileComplete = {
            ID: user.ID,
            username: user.Username,
            email: user.Email,
            nome: profile.Nome,
            dataRegistrazione: user.DataRegistrazione,
            dataBan: null,
            canaleYoutube: profile.CanaleYoutube,
            canaleTwitch: profile.CanaleTwitch,
            profiloInstagram: profile.ProfiloInstagram,
            paginaFacebook: profile.PaginaFacebook,
            profiloSteam: profile.ProfiloSteam, 
          }
          this.usersProfileComplete.push(this.userProfileComplete);
        }
      }
    }
  }

}
