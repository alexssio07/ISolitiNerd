import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { Post } from 'src/app/models/post';
import { BlogserviceService } from 'src/app/services/blogservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/global/alert/alert.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  isAuthenticated: boolean = false;
  currentPost: any;
  currentUserPost: any = "";
  id = 0;
  editPostEnable: boolean = false;
  onClickEdit: boolean = false;
  postForm: FormGroup;
  optionsAlert = {
    autoClose: false,
    keepAfterRouteChange: false,
    timeToClose: 0
  };

  constructor(private authenticateService: AuthenticationServiceService, private blogService: BlogserviceService, 
    private route: ActivatedRoute, private form: FormBuilder, private alertService : AlertService) { }

  ngOnInit() {
    this.isAuthenticated = this.checkIsAuthenticated();
    this.id = this.route.snapshot.params.id;
    this.blogService.getPost({ id: this.id }).then(valuePost => {
      this.currentPost = valuePost;
      this.blogService.getUserPost({ id: this.currentPost.ID_User }).then(valueUsername => {
        if (valueUsername != "" && valueUsername != undefined){
          this.currentUserPost = valueUsername;
          this.editPostEnable = this.authenticateService.getUsernameCookie() == this.currentUserPost ? true : false;
          var date = new Date();
          var today = new Date(date.toLocaleString());
          today.setHours(date.getHours() + (date.getHours() - date.getUTCHours()));
          this.postForm = this.form.group({
            id: [this.currentPost.ID_User],
            titolo: [''],
            contenuto: [''],
            autore: [this.currentUserPost],
            DataUltimaModifica: today,
            DataPubblicazione: this.currentPost.DataPubblicazione,
            ID_User: this.currentPost.ID_User
          });
        }
        else {
          console.log("Impossibile modificare il post.");
        }

      });
    });

  }

  checkIsAuthenticated(): boolean {
    if (this.authenticateService.getUsernameCookie() !== '' && this.authenticateService.getUsernameCookie() !== undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  editPost() {
    this.onClickEdit = true;
  }

  cancelChanges() {
    this.onClickEdit = false;
  }

  savePost() {
    this.blogService.savePost(this.postForm.value).then(value => {
      if (value) {
        this.optionsAlert.autoClose = true;
        this.alertService.success("Post modificato con successo!", this.optionsAlert, 5);
        this.cancelChanges();
      }
      else {
        // TO DO MESSAGGIO ERRORE POST NON SALVATO.
      }
    });
  }

}
