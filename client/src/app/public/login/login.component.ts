import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  passwordErrata: boolean = false;
  ricordami: boolean = false;
  loginForm: FormGroup;
  submitted = false;

  constructor(private route: Router, private form: FormBuilder, private authenticateService: AuthenticationServiceService, private cookieService: CookieService) {
    this.loginForm = this.form.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
    this.cleanCookiesAndVariables();
    if (localStorage.getItem("username") !== null && localStorage.getItem("password") !== null) {
      this.loginForm.setValue({ username: localStorage.getItem("username"), password: localStorage.getItem("password") });
      this.ricordami = true;
    }
  }

  get f() { return this.loginForm.controls; }

  cleanCookiesAndVariables() {
    this.authenticateService.setLoginAvvenutaConSuccesso(false);
    this.authenticateService.setRuolo("");
    if (this.cookieService.check('userName') || this.cookieService.check('token')) {
      this.cookieService.delete('token');
      this.cookieService.delete('userName');
    }
  }

  onChangeRicordami(e) {
    this.ricordami = e.target.checked;
  }

  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticateService.login(this.loginForm.value).then(value => {
      console.log(value);
      var response = JSON.parse(JSON.stringify(value));
      if (value) {
        if (this.ricordami) {
          var user = JSON.parse(JSON.stringify(this.loginForm.value));
          localStorage.setItem('username', user.username);
          localStorage.setItem('password', user.password);
        }
        else {
          if (localStorage.getItem("username") !== null && localStorage.getItem("password") !== null) {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
          }
        }
        this.route.navigate(['/homeprivata']);
      }
      else if (response.passwordError) {
        this.passwordErrata = true;
      }
    });
  }

  openFormRegister() {
    this.route.navigate(['/register']);
  }

  backToHome() {
    this.route.navigate(['/homepublica']);
  }
}
