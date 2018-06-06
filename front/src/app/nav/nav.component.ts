import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  private navTitleList :any[]

  constructor() {
    this.navTitleList = [
      { name: '全部', path: '/' },
      { name: '科幻', path: `/list/${encodeURIComponent('科幻')}` },
      { name: '惊悚', path: `/list/${encodeURIComponent('惊悚')}` },
      { name: '冒险', path: `/list/${encodeURIComponent('冒险')}` },
      { name: '奇幻', path: `/list/${encodeURIComponent('奇幻')}` },
      { name: '悬疑', path: `/list/${encodeURIComponent('悬疑')}` },
      { name: '剧情', path: `/list/${encodeURIComponent('剧情')}` },
      { name: '犯罪', path: `/list/${encodeURIComponent('犯罪')}` },
      { name: '灾难', path: `/list/${encodeURIComponent('灾难')}` },
      { name: '恐怖', path: `/list/${encodeURIComponent('恐怖')}` },
      { name: '战争', path: `/list/${encodeURIComponent('战争')}` },
      { name: '喜剧', path: `/list/${encodeURIComponent('喜剧')}` },
      { name: '音乐', path: `/list/${encodeURIComponent('音乐')}` },
      { name: '文艺', path: `/list/${encodeURIComponent('文艺')}` },
      { name: '励志', path: `/list/${encodeURIComponent('励志')}` }
    ]
  }

  ngOnInit() {
  }

}
