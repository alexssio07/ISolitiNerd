import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { HomePubComponent } from './public/home-pub/home-pub.component';
import { LoginComponent } from './public/login/login.component';
import { BlogComponent } from './public/blog/blog.component';
import { ChisiamoComponent } from './public/chisiamo/chisiamo.component';
import { AffiliazioniComponent } from './public/affiliazioni/affiliazioni.component';
import { RegisterComponent } from './public/register/register.component';
import { RecoverypassComponent } from './public/recoverypass/recoverypass.component';
import { AuthGuardService } from './security/auth-guard.service';
import { HomePrivComponent } from './private/home-priv/home-priv.component';
import { AdministrationComponent } from './private/administration/administration.component';
import { PostComponent } from './public/blog/post/post/post.component';
import { SendmailComponent } from './public/sendmail/sendmail.component';
import { Page404Component } from './global/pagesError/page404/page404.component';
import { Page500Component } from './global/pagesError/page500/page500.component';
import { Page403Component } from './global/pagesError/page403/page403.component';
import { Page412Component } from './global/pagesError/page412/page412.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'homepublica'},
  { path: 'homepublica', component: HomePubComponent },
  { path: 'homeprivata', component: HomePrivComponent, canActivate: [AuthGuardService], data: {ruoli: ['Admin', 'Moderatore', 'Utente']} },
  { path: 'login', component : LoginComponent},
  { path: 'register', component : RegisterComponent },
  { path: 'recoverypassword', component : RecoverypassComponent},
  { path: 'blog', component : BlogComponent },
  { path: 'chisiamo', component : ChisiamoComponent },
  { path: 'affiliazioni', component : AffiliazioniComponent },
  { path: 'amministrazione', component : AdministrationComponent, canActivate: [AuthGuardService], data: {ruoli: ['Admin']} },
  { path: 'blog/post/:id', component : PostComponent },
  { path: 'sendmail', component : SendmailComponent },
  { path: 'pagenotfound', component: Page404Component },
  { path: 'servererror', component: Page500Component },
  { path: 'unathorized', component: Page403Component },
  { path: 'sessiontimeout', component: Page412Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
