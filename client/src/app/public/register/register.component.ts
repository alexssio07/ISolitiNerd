import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { User } from 'src/app/models/user';
import { ProfileUser } from 'src/app/models/profile_user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  usernameIncorrect: boolean = false;
  currentUsername: "";
  submitted = false;


  constructor(private route: Router, public form: FormBuilder, public authenticateService: AuthenticationServiceService) {
    this.registerForm = this.form.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confermapassword: ['', [Validators.required, Validators.minLength(6)]],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      paginaFacebook: [''],
      profiloSteam: [''],
      profiloInstagram: [''],
      canaleYoutube: [''],
      canaleTwitch: [''],
      nickname: [''],
      token: ['']
    });
  }

  ngOnInit() {
  }

  get f() { return this.registerForm.controls; }

  backToHome() {
    this.route.navigate(['/homepublica']);
  }

  registerUser() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.value.password === this.registerForm.value.confermapassword) {
      this.authenticateService.register(this.registerForm.value).then(value => {
        var respValue = JSON.parse(JSON.stringify(value));
        var dataRegistrazione = new Date(respValue.token.dataScadenza);
        if (respValue.auth) {
          this.authenticateService.setTokenCookieDate(respValue.token.key, dataRegistrazione);
        }
        else {
          console.log("errore");
        }
        this.route.navigate(['/homeprivata']);
      });
    }
  }

  onChangeUsername() {
    this.usernameIncorrect = this.registerForm.value.username == this.currentUsername;
  }

}
