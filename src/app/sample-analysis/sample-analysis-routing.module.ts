import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainViewComponent } from './main-view/main-view.component';
import { QueryRunComponent } from './query-run/query-run.component';

const routes: Routes = [
  { path: '', component: MainViewComponent, title:'Lauferstellen' },
  { path: 'suche', component: QueryRunComponent, title: "Laufsuche" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleAnalysisRoutingModule { }
