import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class SalaService {
  private _idSala: number;
  public idSala$: ReplaySubject<number>

  public get idSala(): number{
    return this._idSala;
  }
  public set idSala(id: number) {
    this._idSala = id;
    this.idSala$.next(id);
    
  }
  constructor() {
    this.idSala$ = new ReplaySubject<number>(2);
  }

}
