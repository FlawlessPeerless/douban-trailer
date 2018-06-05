import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from '../test/test.component'

const routes :Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'login', component: TestComponent },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRouterModule { }
