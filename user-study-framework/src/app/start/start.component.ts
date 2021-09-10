import { Component } from '@angular/core';
import { ParticipantService } from '../service/participant.service';
import { SelectAge } from './select.age';
import { SelectEducation } from './select.education';
import { SelectResidence } from './select.residence';
import { SelectProfession } from './select.profession';
import { SelectExperience } from './select.experience';

declare var $: any;   // For jQuery

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

/**
 * This class holds all functionalities for the START form.
 * @class
 * @classdesc StartComponent delivers all required form elements for the START form and stores the information.
 */
export class StartComponent {

  // Select boxes definitions
  public selectAge: SelectAge;
  public selectEducation: SelectEducation;
  public selectResidence: SelectResidence;
  public selectProfession: SelectProfession;
  public selectExperience: SelectExperience;

  // To show an error message
  public errorOccured: boolean;


  /**
   * Creates a new START form.
   * @constructor
   * @param {ParticipantService} participant - The participant service that stores all data of the user study.
   */
  constructor(private participant: ParticipantService) {
    this.selectAge = new SelectAge();
    this.selectEducation = new SelectEducation();
    this.selectResidence = new SelectResidence();
    this.selectProfession = new SelectProfession();
    this.selectExperience = new SelectExperience();
    this.errorOccured = false;
  }

  /** Handles the form submit. */
  public onSubmitClicked(): void {
    // Check parameters
    if (this.selectAge.selected === '' ||
      this.selectEducation.selected === '' ||
      this.selectResidence.selected === '' ||
      this.selectProfession.selected === '' ||
      this.selectExperience.selected === '') {
      // If any of the parameters is empty, show an error message
      this.errorOccured = true;
    } else {
      // Set error message to false
      this.errorOccured = false;
      // Get parameters and store them in participant service
      const params = {
        age: this.selectAge.selected,
        education: this.selectEducation.selected,
        residence: this.selectResidence.selected,
        profession: this.selectProfession.selected,
        experience: this.selectExperience.selected
      };
      this.participant.storeInfo(params);
      // Get token from VRVis server
      $.ajax({
        url: '/survey/b65a1cdb-3e04-4b8f-9ca2-190fae08cfa2',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          // Store csrf token in service
          this.participant.token = data.csrf;
        }
      });
    }
  }

}
