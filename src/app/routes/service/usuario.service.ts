import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Usuario } from "../_data/usuario.model";
import { Observable } from "rxjs/Observable";
import { environment } from '../../../environments/environment';

@Injectable()
export class UsuarioService {

  constructor(private http: Http) { }

  getUsuariosByNombre(nombre): Observable<Usuario[]> {

    // api
    return this.http.get(environment.urlBackBase+'/getAllUsuariosByNombre/' + nombre )
    .map(res => res.json().usuarioList);
  }
}
