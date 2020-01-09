import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialUiModule } from './material-ui.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsgBoxComponent } from './msg-box/msg-box.component';
import { LoginComponent } from './seguranca/login/login.component';
import { InterceptorService } from './seguranca/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    MsgBoxComponent, 
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    FormsModule, 
    MaterialUiModule,
    MatDialogModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [MsgBoxComponent]
})
export class AppModule { }
