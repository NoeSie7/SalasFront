import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceDayName'
})
export class ReduceDayNamePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let letter: string = value;

    if (window.innerWidth < 992) {
      letter = value === 'miercoles' ? 'X' : value.toUpperCase().slice(0, 1);
    }

    return letter;
  }

}
