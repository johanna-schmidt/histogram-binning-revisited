import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParticipantService } from '../service/participant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-studytemplate',
  templateUrl: './studytemplate.component.html',
  styleUrls: ['./studytemplate.component.css']
})

export class StudytemplateComponent implements OnInit, OnDestroy {

  public title: string;

  public studyEnded: boolean;
  public showWelcome: boolean;
  public showExplanation: boolean;
  public showStart: boolean;
  public showSanityCheck: boolean;
  public showStudy: boolean;
  public showFinal: boolean;
  public showDataProtection: boolean;
  public showContact: boolean;

  private pageBefore: string;

  private startPageListener$: Subscription;
  private sanityCheckPageListener$: Subscription;
  private studyResultListener$: Subscription;

  constructor(private participant: ParticipantService) {
    this.title = 'user-study';
    this.studyEnded = false;
    this.setShowWelcome();
    this.pageBefore = 'welcome';
  }

  ngOnInit(): void {
    this.startPageListener$ = this.participant.infoStored$.subscribe((isSet) => {
      if (isSet) {
        this.setShowSanityCheck();
      }
    });
    this.sanityCheckPageListener$ = this.participant.sanityCheckStored$.subscribe((isSet) => {
      if (isSet) {
        this.setShowStudy();
      }
    });
    this.studyResultListener$ = this.participant.resultsStored$.subscribe((isSet) => {
      if (isSet) {
        this.setShowFinal();
      }
    });
  }

  ngOnDestroy(): void {
    this.startPageListener$?.unsubscribe();
    this.sanityCheckPageListener$?.unsubscribe();
    this.studyResultListener$?.unsubscribe();
  }

  public onStartClicked(): void {
    this.setShowExplanation();
  }

  public onExplanationNextClicked(): void {
    this.setShowStart();
  }

  public onNewClicked(): void {
    this.setShowWelcome();
  }

  public onDataProtectionClicked(): void {
    if (this.showWelcome) {
      this.pageBefore = 'welcome';
    } else {
      this.pageBefore = 'final';
    }
    this.setShowDataProtection();
  }

  public onContactClicked(): void {
    if (this.showWelcome) {
      this.pageBefore = 'welcome';
    } else {
      this.pageBefore = 'final';
    }
    this.setShowContact();
  }

  public onBackClicked(): void {
    if (this.pageBefore === 'welcome') {
      this.setShowWelcome();
    } else {
      this.setShowFinal();
    }
  }

  private setShowWelcome(): void {
    this.showWelcome = true;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowExplanation(): void {
    this.showWelcome = false;
    this.showExplanation = true;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowStart(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = true;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowSanityCheck(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = true;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowStudy(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = true;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowFinal(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = true;
    this.showDataProtection = false;
    this.showContact = false;
  }

  private setShowDataProtection(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = true;
    this.showContact = false;
  }

  private setShowContact(): void {
    this.showWelcome = false;
    this.showExplanation = false;
    this.showStart = false;
    this.showSanityCheck = false;
    this.showStudy = false;
    this.showFinal = false;
    this.showDataProtection = false;
    this.showContact = true;
  }
}
