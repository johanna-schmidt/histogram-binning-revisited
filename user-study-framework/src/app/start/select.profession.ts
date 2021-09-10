
/**
 * Checkbox for selecting the profession.
 * @class
 * @classdesc Stores the required professions.
 */
export class SelectProfession {

  public options: any[] = [
    { value: '', name: ' -- Please select -- ' },
    { value: 'student', name: 'Student' },
    { value: 'research-edu', name: 'Working full/part-time in research/education' },
    { value: 'full-time', name: 'Working full-time' },
    { value: 'part-time', name: 'Working part-time' },
    { value: 'retired', name: 'Retired' },
    { value: 'n/a', name: 'Prefer not to say' }
  ];

  public selected: string = '';
}
