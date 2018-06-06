import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { IndexComponent } from './index.component'
import { IndexSidebarComponent } from './index-sidebar.component'

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        IndexComponent,
        IndexSidebarComponent
    ],
    exports: [ IndexComponent ]
})
export class IndexModule { }
