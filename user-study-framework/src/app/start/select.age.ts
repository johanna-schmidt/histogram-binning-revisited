
/**
 * Checkbox for selecting the age range.
 * @class
 * @classdesc Stores the required age classes.
 */
export class SelectAge {

  public options: any[] = [
    { value: '', name: ' -- Please select -- ' },
    { value: '0-19', name: '0-19' },
    { value: '20-29', name: '20-29' },
    { value: '30-49', name: '30-49' },
    { value: '50-69', name: '50-69' },
    { value: '70+', name: '70+' },
    { value: 'n/a', name: 'Prefer not to say' }
  ];

  public selected: string = '';
}
