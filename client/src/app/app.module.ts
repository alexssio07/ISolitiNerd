import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { HomePubComponent } from './public/home-pub/home-pub.component';
import { NavbarPubComponent } from './public/navbar-pub/navbar-pub.component';
import { NavbarPrivComponent } from './private/navbar-priv/navbar-priv.component';
import { ProfileDetailComponent } from './private/profile-detail/profile-detail.component';
import { HomePrivComponent } from './private/home-priv/home-priv.component';
import { PostCreateComponent } from './private/post-create/post-create.component';
import { AdministrationComponent } from './private/administration/administration.component';
import { FooterComponent } from './global/footer/footer.component';
import { BlogComponent } from './public/blog/blog.component';
import { ChisiamoComponent } from './public/chisiamo/chisiamo.component';
import { AffiliazioniComponent } from './public/affiliazioni/affiliazioni.component';
import { RegisterComponent } from './public/register/register.component';
import { RecoverypassComponent } from './public/recoverypass/recoverypass.component';
import { PostComponent } from './public/blog/post/post/post.component';
import { SendmailComponent } from './public/sendmail/sendmail.component';
import { NavbarAmministrationComponent } from './private/administration/navbar-amministration/navbar-amministration.component';
import { UtentibanComponent } from './private/administration/utentiban/utentiban.component';
import { PostsComponent } from './private/administration/posts/posts.component';
import { PostainarrivoComponent } from './private/administration/postainarrivo/postainarrivo.component';
import { SegnalazionibugComponent } from './private/administration/segnalazionibug/segnalazionibug.component';
import { GestioneaffiliazioniComponent } from './private/administration/gestioneaffiliazioni/gestioneaffiliazioni.component';
import { AlertComponent } from './global/alert/alert.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Page404Component } from './global/pagesError/page404/page404.component';
import { Page403Component } from './global/pagesError/page403/page403.component';
import { Page500Component } from './global/pagesError/page500/page500.component';
import { Page412Component } from './global/pagesError/page412/page412.component';
import { StatspostsComponent } from './private/administration/posts/statsposts/statsposts.component';
import { StatsutentiComponent } from './private/administration/utentiban/statsutenti/statsutenti.component';
import { HttpErrorInterceptor } from './global/interceptors/HttpErrorInterceptor';
import { HttpLoaderInterceptor } from './global/interceptors/HttpLoaderInterceptor';
import { InterceptorService } from './global/interceptors/interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CookieService } from 'ng2-cookies/cookie';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { SafePipe } from './global/safe.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePubComponent,
    NavbarPubComponent,
    NavbarPrivComponent,
    ProfileDetailComponent,
    HomePrivComponent,
    PostCreateComponent,
    AdministrationComponent,
    FooterComponent,
    BlogComponent,
    ChisiamoComponent,
    AffiliazioniComponent,
    RegisterComponent,
    RecoverypassComponent,
    PostComponent,
    PostsComponent,
    SendmailComponent,
    NavbarAmministrationComponent,
    UtentibanComponent,
    AlertComponent,
    Page404Component,
    Page403Component,
    Page500Component,
    Page412Component,
    PostainarrivoComponent,
    SegnalazionibugComponent,
    GestioneaffiliazioniComponent,
    StatspostsComponent,
    StatsutentiComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    FilterPipeModule,
    OrderModule
  ],
  providers: [
    LoginComponent, 
    CookieService,     
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoaderInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
