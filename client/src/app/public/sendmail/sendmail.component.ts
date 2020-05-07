import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SendmailService } from 'src/app/services/public/sendmail/sendmail.service';
import { Email } from 'src/app/models/email';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { AlertService } from 'src/app/global/alert/alert.service';

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.css']
})
export class SendmailComponent implements OnInit {

  name: string = "";
  nickname: string = "";
  email: string =  "";
  typeSupports: {}[] = [];
  message: string = "";
  fromSystem: boolean = false;
  sendMailForm : FormGroup;
  optionsAlert = {
    autoClose: false,
    keepAfterRouteChange: false,
    timeToClose: 0
  };

  constructor(private route : Router, private form : FormBuilder, private sendMailer : SendmailService, 
    private authenticateService : AuthenticationServiceService, private alertService: AlertService) {
    this.sendMailForm = this.form.group({
      name: [""],
      nickname: [""],
      email: [""],
      request: [""],
      message: [""],
      typeSupportForm: [''],
      fromSystem: this.fromSystem
    });
    this.typeSupports = this.getTypeSupports();
   }

  ngOnInit() {
    
  }


  sendMailValidation(emailValue) {
    var emailToSend : Email = emailValue;
    emailToSend.FromSystem = true;
    this.authenticateService.createKeyLogin(emailToSend).then(valueKey => {
      emailToSend.Key = JSON.stringify(valueKey);
      this.sendMailer.sendMailValidation(emailToSend).then(valueMail => {
        let valueInfoMail = JSON.parse(JSON.stringify(valueMail));
        this.optionsAlert.autoClose = true;
        if (valueInfoMail.accepted.length > 0){
          this.alertService.success("E-Mail spedita con successo!", this.optionsAlert, 4);
        }
        if (valueInfoMail.rejected.length > 0){
          this.alertService.error("ERRORE: E-Mail non spedita.", this.optionsAlert, 6);
        }
      });
    });

  }

  sendMailFromUser(mail) {
    mail.fromSystem = false;
    this.sendMailer.sendMailFromUser(mail).then(value => {
      let valueInfoMail = JSON.parse(JSON.stringify(value));
      if (valueInfoMail.accepted.length > 0){
        console.log("mail spedita");
      }
      if (valueInfoMail.rejected.length > 0){
        console.log("mail non spedite");
      }
    });
  }


  getTypeSupports () : {}[]  {
    return [
      { descr : '',  selected : true },
      { descr : 'Segnalazione', selected : false },
      { descr : 'Richiesta', selected : false },
      { descr : 'Aiuto', selected : false },
      { descr : 'Altro...', selected : false }
    ];
  }
}
