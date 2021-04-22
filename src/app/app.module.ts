import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ngx-toastr';

import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MarkdownModule } from 'ngx-markdown';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import { ServicesComponent } from './services/services.component';
// import { StatusComponent } from './status/status.component';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { V1ApiService } from './v1api.service';
import { HttpClientModule } from '@angular/common/http';
import { ServiceComponent } from './service/service.component';
//import { StatusSingleComponent } from './status-single/status-single.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { NewServiceComponent } from './new-service/new-service.component';

import { ChartsModule } from 'ng2-charts';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogUserInComponent } from './log-user-in/log-user-in.component';

import { ClipboardModule } from 'ngx-clipboard';

import {
  HighlightModule,
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from 'ngx-highlightjs';
import { NotInvitedComponent } from './not-invited/not-invited.component';

//import { Ng2GoogleChartsModule } from "ng2-google-charts";
import { MonacoEditorModule } from 'ngx-monaco-editor';
import {
  CreateKeyDialogComponent,
  SettingsComponent,
} from './settings/settings.component';
//import { EventsComponent } from './events/events.component';
import { DateAgoPipe } from './dateago.pipe';
//import { EventsListComponent } from './events-list/events-list.component';
//import { StatChartsComponent } from './stat-charts/stat-charts.component';
//import { TraceListComponent } from './trace-list/trace-list.component';
import { EndpointListComponent } from './endpoint-list/endpoint-list.component';
import { LogsComponent } from './logs/logs.component';
import { NodesComponent } from './nodes/nodes.component';
import { RegisterComponent } from './register/register.component';
import { TimeagoModule } from 'ngx-timeago';
import { TitlePipe } from './title.pipe';
import {
  SnippetComponent,
  DialogOverviewExampleDialog,
} from './snippet/snippet.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'ngx-easy-table';

import hljs from 'highlight.js';
import { ApisComponent } from './apis/apis.component';
import { QuotaService } from './quota.service';
import { ApiSingleComponent } from './api-single/api-single.component';
import { ApiEndpointsComponent } from './api-endpoints/api-endpoints.component';
import { PropertyListerComponent } from './property-lister/property-lister.component';
import { UsageComponent } from './usage/usage.component';
import { UsageService } from './usage.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BalanceService } from './balance.service';
import { PaymentsComponent } from './payments/payments.component';
import { NgxStripeModule } from 'ngx-stripe';

document.defaultView['hljs'] = hljs;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    ServicesComponent,
    // StatusComponent,
    ServiceComponent,
    SearchPipe,
    NewServiceComponent,
    WelcomeComponent,
    LogUserInComponent,
    NotInvitedComponent,
    SettingsComponent,
    CreateKeyDialogComponent,
    //EventsComponent,
    DateAgoPipe,
    //EventsListComponent,
    //StatChartsComponent,
    //StatusSingleComponent,
    //TraceListComponent,
    EndpointListComponent,
    LogsComponent,
    NodesComponent,
    RegisterComponent,
    TitlePipe,
    SnippetComponent,
    DialogOverviewExampleDialog,
    ApisComponent,
    ApiSingleComponent,
    ApiEndpointsComponent,
    PropertyListerComponent,
    UsageComponent,
    PaymentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    FlexLayoutModule,
    MatMenuModule,
    TimeagoModule.forRoot(),
    HttpClientModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    ChartsModule,
    ClipboardModule,
    HighlightModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MonacoEditorModule.forRoot(),
    TableModule,
    MatSelectModule,
    MatGridListModule,
    ToastrModule.forRoot(),
    MarkdownModule.forRoot(),
    HighlightModule,
    NgxChartsModule,
    NgxStripeModule.forRoot('pk_test_wuI8wlKwKBUZ9iHnYlQPa8BH'),
  ],
  providers: [
    CookieService,
    UserService,
    V1ApiService,
    QuotaService,
    UsageService,
    BalanceService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          javascript: () => import('highlight.js/lib/languages/javascript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
          json: () => import('highlight.js/lib/languages/json'),
          go: () => import('highlight.js/lib/languages/go'),
          shell: () => import('highlight.js/lib/languages/shell'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog, CreateKeyDialogComponent],
})
export class AppModule {}
