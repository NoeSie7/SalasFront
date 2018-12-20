import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ValidatorsService {

  constructor() { }

  formatemail(control: AbstractControl) {
    let error = null;
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value))) {
      error = { 'format': true };
    }
    return error;
  }

}
