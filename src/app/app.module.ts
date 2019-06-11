import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NotificationModule} from '../shared/modules/notification.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SetupService} from '../services/api-folder/setup-service';
import {UserService} from '../services/user.service';
import {ApiHandlerService} from '../services/api-handler.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ValidationErrorService} from '../services/validation-error.service';
import {EventsService} from '../services/event.service';

const APP_ROUTES = [
  {path: '', component: AppComponent}
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NotificationModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
    ReactiveFormsModule
  ],
  providers: [
    SetupService,
    UserService,
    ApiHandlerService,
    ValidationErrorService,
    EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
