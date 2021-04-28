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

const routes: Routes = [
  //{
  //  path: 'status',
  //  component: StatusComponent,
  //},
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
  //{
  //  path: 'status/:id/:version',
  //  component: StatusSingleComponent,
  //  canActivate: [AuthGuard],
  //},
  //{
  //  path: 'status/:id/:version/:tab',
  //  component: StatusSingleComponent,
  //  canActivate: [AuthGuard],
  //},
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
  //{
  //  path: 'events',
  //  component: EventsComponent,
  //  canActivate: [AuthGuard],
  //},
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
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: ':id',
    component: ApiSingleComponent,
  },
  {
    path: 'overview/usage',
    component: UsageComponent,
  },
  {
    path: 'overview/billing',
    component: PaymentsComponent,
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
