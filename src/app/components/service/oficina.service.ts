import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Oficina } from '../_data/oficina.model';
import { Sala } from '../_data/sala.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class OficinaService {

  public currentOficina: Oficina;

  public salasList: Sala[];

  constructor(private http: Http) {  }

  getCurrentOficina(): Oficina {
    return this.currentOficina;
  }

  getOficinas(): Observable<Oficina[]> {
    // api
    return this.http.get(environment.urlBackBase + '/getAllOficinas')
      .map(res => res.json().oficinaList);
  }

  getSalasByOficina(idOficina): Observable<any> {
    // api
    return this.http.get(environment.urlBackBase + '/getAllSalasByIdOficina/' + idOficina)
      .map(res => res.json().salaList);
  }

  updateSalaList(salas) {
    this.salasList = salas;
  }

  updateCurrentOficina(idOficina): Observable<any> {
    return this.http.get(environment.urlBackBase + '/getOficinaById/' + idOficina)
    .map( res => res.json().oficina);
  }

}
