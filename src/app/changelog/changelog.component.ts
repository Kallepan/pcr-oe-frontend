import { Component } from '@angular/core';
import { CONSTANTS } from '../config/constants';

export interface ChangelogData {
  version: string,
  date: string
  changes: string[]
}

const CHANGELOG_DATA: ChangelogData[] = [
  {
    version: CONSTANTS.VERSION,
    date: "24.08.2023",
    changes: [
      "Veroeffentlichung der ersten Version",
    ]
  },
]

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent {
  changelogData = CHANGELOG_DATA;
  currentVersion = CONSTANTS.VERSION;
}
