
/**
 * Checkbox for selecting the type of education.
 * @class
 * @classdesc Stores the required education types.
 */
export class SelectEducation {

  public options: any[] = [
    { value: '', name: ' -- Please select -- ' },
    { value: 'high-school', name: 'High School' },
    { value: 'bachelor', name: 'Bachelor Degree' },
    { value: 'master', name: 'Master Degree' },
    { value: 'phd', name: 'PhD or higher' },
    { value: 'trade-school', name: 'Trade School' },
    { value: 'n/a', name: 'Prefer not to say' }
  ];

  public selected: string = '';
}
