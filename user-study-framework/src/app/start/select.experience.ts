
/**
 * Checkbox for selecting the visualisation experience.
 * @class
 * @classdesc Stores the required visualisation experience categories.
 */
export class SelectExperience {

  public options: any[] = [
    { value: '', name: ' -- Please select -- ' },
    { value: 'none', name: 'No experience' },
    { value: 'media', name: 'I notice them sometimes in newspapers or TV' },
    { value: 'experienced', name: 'I interact with them regularly' },
    { value: 'expert', name: 'I create them myself' }
  ];

  public selected: string = '';
}
