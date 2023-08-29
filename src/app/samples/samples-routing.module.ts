import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONSTANTS } from '../config/constants';
import { SamplesViewComponent } from './samples-view/samples-view.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path: '', component: SamplesViewComponent, title: "Probenübersicht"},
  {path: 'search', component: SearchComponent, title: "Probensuche"},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplesRoutingModule { }
