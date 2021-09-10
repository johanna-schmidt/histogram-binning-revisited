
/**
 * Checkbox for selecting the residence.
 * @class
 * @classdesc Stores the required residence types.
 */
export class SelectResidence {

  public options: any[] = [
    { value: '', name: ' -- Please select -- ' },
    { value: 'Austria', name: 'Austria' },
    { value: 'EU', name: 'Other EU country' },
    { value: 'non-EU', name: 'Outside EU' }
  ];

  public selected: string = '';
}
