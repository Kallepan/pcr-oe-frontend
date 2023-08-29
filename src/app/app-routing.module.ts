import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONSTANTS } from './config/constants';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';

const routes: Routes = [
  {path: 'proben', loadChildren: () => import('./samples/samples.module').then(m => m.SamplesModule), title: 'Proben', canActivate: [authGuard]},
  {path: 'laeufe', loadChildren: () => import('./sample-analysis/sample-analysis.module').then(m => m.SampleAnalysisModule), title: 'Läufe', canActivate: [authGuard]},
  {path: 'changelog', loadChildren: () => import('./changelog/changelog.module').then(m => m.ChangelogModule), title: 'Changelog', canActivate: [authGuard]},
  {path: '**', component: HomeComponent, title: CONSTANTS.TITLE},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
