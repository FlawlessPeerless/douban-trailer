import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from '../test/test.component'

import { IndexComponent } from '../index/index.component'

const routes :Routes = [
  { path: '', component: IndexComponent },
  { path: 'detail/:id' , component: TestComponent },
]

@NgModule({
  declarations: [ 
    TestComponent
  ],
  imports: [ 
    RouterModule.forRoot(routes, { enableTracing: true }),
  ],
  exports: [ RouterModule ]
})
export class AppRouterModule { }
