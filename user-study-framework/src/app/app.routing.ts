import { RouterModule, Routes } from '@angular/router';
import { StudytemplateComponent } from './studytemplate/studytemplate.component';
import { ShowmeComponent } from './showme/showme.component';
import { ResultsPilotComponent } from './results-pilot/results-pilot.component';
import { ResultsCurrentComponent } from './results-current/results-current.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AllDatasetsComponent } from './alldatasets/alldatasets.component';

export const routes: Routes = [
  { path: '', component: StudytemplateComponent },
  { path: 'showmyresults/:token', component: ShowmeComponent },
  { path: 'currentstate/pilot', component: ResultsPilotComponent },
  { path: 'currentstate/study', component: ResultsCurrentComponent },
  { path: 'studyresults', component: ResultsCurrentComponent },
  { path: 'alldatasets', component: AllDatasetsComponent },
  { path: '**', component: PagenotfoundComponent }
  ];

export const AppRoutes = RouterModule.forRoot(routes);
