import { Component } from '@angular/core'

@Component({
    selector: 'app-index-sidebar',
    templateUrl: './index-sidebar.component.html',
    styleUrls: [ './index-sidebar.component.scss' ]
})
export class IndexSidebarComponent {
    yearList :number[]
    selectedYear :number

    constructor() {
        this._initYearList()
        this.selectedYear = this.yearList[0]
    }

    private _initYearList() {
        let now = new Date()
        let cap = 8
        let yearList = []
        for (let i = 0; i < cap; i++) {
            yearList[i] = now.getFullYear() + i
        }

        this.yearList = yearList
    }

    private _chooseYear(year :number) {
        if (this.selectedYear == year) return
        this.selectedYear = year
    }
}