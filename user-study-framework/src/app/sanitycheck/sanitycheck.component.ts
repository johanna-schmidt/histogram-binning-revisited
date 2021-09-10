import { Component } from '@angular/core';
import { RadioGroup } from './radio';
import { ParticipantService } from '../service/participant.service';

@Component({
  selector: 'app-sanitycheck',
  templateUrl: './sanitycheck.component.html',
  styleUrls: ['./sanitycheck.component.css']
})

/**
 * This class holds all functionalities for the SANITYCHECK forms.
 * @class
 * @classdesc SanitycheckComponent delivers all required form elements for the SANITYCHECK form and stores the information.
 */
export class SanitycheckComponent {

  // Variables to show certain parts of the page
  public showFirst: boolean;
  public showSecond: boolean;
  public errorOccured: boolean;

  // Classes to deliver the values for the radio buttons
  public radio1: RadioGroup;
  public radio2: RadioGroup;


  /**
   * Creates a new SANITYCHECK form.
   * @constructor
   * @param {ParticipantService} participant - The participant service that stores all data of the user study.
   */
  constructor(private participant: ParticipantService) {
    this.showFirst = true;
    this.showSecond = false;
    this.errorOccured = false;
    this.radio1 = new RadioGroup();
    this.radio2 = new RadioGroup();
  }

  /** For submitting the first form. */
  public submitFirst(): void {
    // Check parameters
    if (this.radio1.value === undefined || this.radio1.value === '') {
      // No radio button has been selected
      this.errorOccured = true;
    } else {
      // Everything fine, store the parameters
      this.errorOccured = false;
      this.showFirst = false;
      this.showSecond = true;
    }
  }

  /** For submitting the second form. */
  public submitSecond(): void {
    // Check parameters
    if (this.radio2.value === undefined || this.radio2.value === '') {
      // No radio button has been selected
      this.errorOccured = true;
    } else {
      // Everything fine, store the parameters
      const params = {
        q1: this.radio1.value,
        q2: this.radio2.value
      };
      // Store the values in the participant service
      this.participant.storeSanityCheck(params);
    }
  }

}
