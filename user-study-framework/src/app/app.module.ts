import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { SanitycheckComponent } from './sanitycheck/sanitycheck.component';
import { StudyComponent } from './study/study.component';
import { ResultsPilotComponent } from './results-pilot/results-pilot.component';
import { ResultsCurrentComponent } from './results-current/results-current.component';
import { ShowmeComponent } from './showme/showme.component';
import { AppRoutes } from './app.routing';
import { StudytemplateComponent } from './studytemplate/studytemplate.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AllDatasetsComponent } from './alldatasets/alldatasets.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes
  ],
  declarations: [
    AppComponent,
    StartComponent,
    SanitycheckComponent,
    StudyComponent,
    ResultsPilotComponent,
    ResultsCurrentComponent,
    ShowmeComponent,
    StudytemplateComponent,
    PagenotfoundComponent,
    AllDatasetsComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
