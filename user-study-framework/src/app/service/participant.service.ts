import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

/**
 * This class holds all data stored for a participant.
 * @class
 * @classdesc ParticipantService stores all survey data.
 */
export class ParticipantService {

  // User study contents
  public token: string;
  private studyParticipantInfo: any;
  private studySanityCheck: any;
  private studyData: any[];

  // Observables
  public infoStored$: BehaviorSubject<boolean>;
  public sanityCheckStored$: BehaviorSubject<boolean>;
  public resultsStored$: BehaviorSubject<boolean>;


  /**
   * Creates a new participant service.
   * @constructor
   */
  constructor() {
    this.infoStored$ = new BehaviorSubject<boolean>(false);
    this.sanityCheckStored$ = new BehaviorSubject<boolean>(false);
    this.resultsStored$ = new BehaviorSubject<boolean>(false);
  }

  /** Stores participant information. */
  public storeInfo(params: any): void {
    this.studyParticipantInfo = params;
    this.infoStored$.next(true);
  }

  /** Stores sanity check results. */
  public storeSanityCheck(params: any): void {
    this.studySanityCheck = params;
    this.sanityCheckStored$.next(true);
  }

  /** Stores study results. */
  public storeStudyResuls(results: any[]): void {
    this.studyData = results;
    this.finalize();
    this.resultsStored$.next(true);
  }

  /** Summarizes study data into one JSON. */
  private finalize(): void {
    // Create finale JSON
    const finalJson = {
      csrf: this.token,
      data: {
        timestamp: Date.now(),
        participant: this.studyParticipantInfo,
        sanitycheck: this.studySanityCheck,
        results: this.studyData
      }
    };
    // Send data to VRVis server
    $.ajax({
      url: '/survey/b65a1cdb-3e04-4b8f-9ca2-190fae08cfa2',
      type: 'POST',
      data: JSON.stringify(finalJson),
      success: (msg) => { console.log(msg); }
    });
  }

}
