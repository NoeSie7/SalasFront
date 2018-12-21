import { Pipe, PipeTransform } from '@angular/core';

import { Oficina } from './oficina.model';

@Pipe({
    name: 'oficinaFilter',
    pure: false
})
export class OficinaFilterPipe implements PipeTransform {
    transform(items: Oficina[], filter: Oficina): Oficina[] {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item: Oficina) => this.applyFilter(item, filter));
    }

    applyFilter(oficina: Oficina, filter: Oficina): boolean {
        for (const field in filter) {
            if (filter[field]) {
                if (typeof filter[field] === 'string') {
                    // starts with
                    // return oficina[field].toLowerCase().startsWith(filter[field].toLowerCase());
                   // contains
                    if (oficina[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof filter[field] === 'number') {
                    // equal number value
                    if (oficina[field] !== filter[field]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
