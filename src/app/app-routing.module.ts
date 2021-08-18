import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ServiceComponent } from './service/service.component';
import { NewServiceComponent } from './new-service/new-service.component';
import { AuthGuard } from './auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { NotInvitedComponent } from './not-invited/not-invited.component';
import { SettingsComponent } from './settings/settings.component';
//import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
//import { StatusComponent } from './status/status.component';
//import { StatusSingleComponent } from './status-single/status-single.component';
import { ApisComponent } from './apis/apis.component';
import { HomeComponent } from './home/home.component';
import { ApiSingleComponent } from './api-single/api-single.component';
import { UsageComponent } from './usage/usage.component';
import { PaymentsComponent } from './payments/payments.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { GithubLoginComponent } from './github-login/github-login.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';

const routes: Routes = [
  {
    path: 'getting-started',
    component: GettingStartedComponent,
  },
  {
    path: 'github-login',
    component: GithubLoginComponent,
  },
  {
    path: 'google-login',
    component: GoogleLoginComponent,
  },
  {
    path: 'not-invited',
    component: NotInvitedComponent,
  },
  {
    path: 'service/new',
    component: NewServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service/new/:id',
    component: NewServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'service/:id',
    component: ServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'settings/:id',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'apis',
    component: ApisComponent,
  },
  {
    path: 'service/:id/:tab',
    component: ServiceComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'explore',
    component: SearchPageComponent,
  },
  {
    path: 'overview/usage',
    component: UsageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'overview/billing',
    component: PaymentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: ApiSingleComponent,
  },
  {
    path: ':id/:tab',
    component: ApiSingleComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
