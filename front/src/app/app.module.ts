import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { AppRouterModule } from './router/router.module';
import { NavModule } from './nav/nav.module';
import { IndexModule } from './index/index.module'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NavModule,
    AppRouterModule,
    IndexModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
