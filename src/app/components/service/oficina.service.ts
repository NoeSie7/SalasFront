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

  getCurrentOficina(idOficina): Observable<Oficina> {
    //return this.currentOficina;
    console.log(idOficina)
    return this.http.get(environment.urlBackBase + '/getOficinaById/' + idOficina)
    .map(res => res.json());
  }

  getOficinas(): Observable<Oficina[]> {
    // initial json mock
    /*return this.http.get('./assets/json_data/oficinas.json')
      .map(res => res.json().oficinaList);*/

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

}
