import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Reserva} from '../_data/reserva.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReservaService {

  constructor(private http: Http) {
  }

  getReservasBySala(idSala): Observable<Reserva[]> {
    // api
    return this.http.get(environment.urlBackBase + '/getAllReservasByIdSala/' + idSala)
      .map(res => res.json().reservaAuxList);
  }

  getReservasBySalaAndDate(idSala, date): Observable<any> {
    /**
     El campo minutoDesde de las reservas se calcula de la siguiente forma:
     ((hora de la reserva * 60 + minutos de la reserva) - 480) * 0.15

     Por ejemplo, si la reserva es de 9:15 a 9:30 el calculo seria el siguiente:
     ((9 * 60 + 15) - 480) * 0.15

     La resta de 480 es debido a que se toma como minuto 0 las 8 AM y
     la multiplicacion de 0.15 es la proporcion en % de lo que
     ocupa un minuto en el timeline. */
      // temporal mock
    // const responseAux = {
    //     "success": "OK", "mensaje": "OK", "reservaAuxList": [
    //       {
    //         "idReserva": 1,
    //         "idSala": 3,
    //         "usuario": {
    //           "idUsuario": 1,
    //           "nombre": "Emilio Pañero",
    //           "extension": "899",
    //           "email": "emilio.panerorodriguez@plexus.es"
    //         },
    //         "fecha": "19-09-2017",
    //         "horaDesde": "08:00",
    //         "horaHasta": "09:00",
    //         "duracion": 60,
    //         "minutoDesde": 0,
    //         "asunto": "Daily"
    //       },
    //       {
    //         "idReserva": 2,
    //         "idSala": 3,
    //         "usuario": {
    //           "idUsuario": 1,
    //           "nombre": "Emilio Pañero",
    //           "extension": "899",
    //           "email": "emilio.panerorodriguez@plexus.es"
    //         },
    //         "fecha": "19-09-2017",
    //         "horaDesde": "09:00",
    //         "horaHasta": "10:00",
    //         "duracion": 60,
    //         "minutoDesde": 60,
    //         "asunto": "Reunión general"
    //       },
    //       {
    //         "idReserva": 4,
    //         "idSala": 3,
    //         "usuario": {
    //           "idUsuario": 1,
    //           "nombre": "Emilio Pañero",
    //           "extension": "899",
    //           "email": "emilio.panerorodriguez@plexus.es"
    //         },
    //         "fecha": "19-09-2017",
    //         "horaDesde": "10:00",
    //         "horaHasta": "18:00",
    //         "duracion": 480,
    //         "minutoDesde": 120,
    //         "asunto": "Reunión general con Agrasar"
    //       },
    //       {
    //         "idReserva": 5,
    //         "idSala": 3,
    //         "usuario": {
    //           "idUsuario": 1,
    //           "nombre": "Emilio Pañero",
    //           "extension": "899",
    //           "email": "emilio.panerorodriguez@plexus.es"
    //         },
    //         "fecha": "19-09-2017",
    //         "horaDesde": "18:00",
    //         "horaHasta": "19:00",
    //         "duracion": 60,
    //         "minutoDesde": 600,
    //         "asunto": "Inicio de Sprint"
    //       }
    //     ]
    //   };
    // return this.http.get('/sala/' + idSala + '/reservas/' + this.getFormatedDateForRest(date))
    //   .map(res => responseAux);

    // api
    return this.http.get(environment.urlBackBase + '/sala/' + idSala + '/reservas/' + this.getFormatedDateForRest(date))
      .map(res => res.json());
  }

  insertOrUpdateReserva(reserva): Observable<any> {
    // api
    reserva.fecha = this.getFormatedDateForRest(reserva.fecha);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(environment.urlBackBase + '/insertOrUpdateReserva', JSON.stringify(reserva), options)
      .map(res => res.json());
  }

  insertOrUpdateReservas(reserva): Observable<any> {
        // api
        reserva.fecha = this.getFormatedDateForRest(reserva.fecha);
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        return this.http.post(environment.urlBackBase + '/insertOrUpdateReservas', JSON.stringify(reserva), options)
           .map(res => res.json());
    }

  deleteReserva(idReserva): Observable<any> {
    // api
    return this.http.get(environment.urlBackBase + '/deleteReserva/' + idReserva).map(res => res.json());
  }

  getFormatedDateForRest(date) {
    if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return date.split('/').reverse().join('-');
    }
    if (date.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return date.split('/').join('-');
    }
    if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return date.split('-').reverse().join('-');
    }
  }

  getFormatedDateForResponse(date) {
    if (date.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      return date.split('/').reverse().join('/');
    }
    if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return date.split('-').join('/');
    }
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date.split('-').reverse().join('/');
    }
  }

}
