import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
// import moment = require('moment');
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { ReservaService } from '../service/reserva.service';
import { Sala } from '../_data/sala.model';
import { Observable } from 'rxjs';
import { toast } from 'angular2-materialize';
import { OficinaService } from '../service/oficina.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  private calendarOptions: Options;
  private date: Date;
  private events = [];

  public currentSala = new Sala();
  public currentSala$: Observable<Sala>;


  public salas = new Array<Sala>();
  public salas$: Observable<Sala[]>;

  public numberroom: Number;


   @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

   constructor(private route: ActivatedRoute,
    private sharedService: SharedService,
    private reservaService: ReservaService,
    private oficinaService: OficinaService) {}

   ngOnInit() {

     this.calendarOptions = {
        editable: true,
        eventLimit: true,
        header: {
          left: '',
          center: 'title',
          right: 'prev,next',
          // right: 'month,agendaWeek,agendaDay,listMonth, basicWeek'
        },
        businessHours: {
          dow: [1, 2, 3, 4, 5],
          start: moment.duration('08:00:00'),
          end: moment.duration('19:00:00')
        },
        allDaySlot: false, // elimina casilla de alldays
        weekends: false,
        events: this.events,
        // eventColor: '#3498DB',
        // eventBackgroundColor: 'yellow',
        // eventTextColor: 'green',
        defaultView: 'agendaWeek',
        locale: 'es', // Idioma del calendario
        minTime: moment.duration('07:00:00'), // Duracion generica del calendario
        maxTime: moment.duration('20:00:00'),
      };

      this.loadEvents();
  }
      clearEvents() {
       this.events = [];
     }

      loadEvents() {
        // console.log();
          this.oficinaService.getSalasByOficina(this.route.snapshot.params.office).subscribe( res => {
            console.log('RES', res);
              this.salas = res;
          });
          this.numberroom = this.route.snapshot.params.room;

        // if (this.route.snapshot.params.room !== undefined) {

        //    this.reservaService
        //      .getReservasBySalaAndDate(
        //        this.route.snapshot.params.room,
        //        this.sharedService.currentDate
        //      )
        //      .subscribe(responseAux => {
        //        console.log('RESPONSEAUX', responseAux);
        //        if (
        //          responseAux.result === 'Success' &&
        //          responseAux.mensaje === 'Success'
        //        ) {
        //         //  console.log('HORAS', this.restarHoras(responseAux.reservaAuxList));
        //          this.restarHoras(responseAux.reservaAuxList);
        //          this.currentSala.reservas = responseAux.reservaAuxList;
        //           //  console.log('RESERVA', this.currentSala.reservas);
        //           //  console.log('CURRENT SALA RESERVA', this.currentSala);

        //           this.currentSala.reservas.forEach(e => {
        //             const dateinicio = new Date(this.convertHoras(e.fecha)
        //             + ' ' +  e.horaDesde);
        //             const datefin = new Date(this.convertHoras(e.fecha)
        //             + ' ' +  e.horaHasta);

        //             console.log('parseo', dateinicio);

        //             const el = {
        //             start: dateinicio,
        //             title: e.asunto,
        //             end: datefin,
        //             };
        //             console.log('ELEMENTO', el);

        //             this.events.push(el);
        //                               });

        //        } else {
        //         console.log('No ha habido coincidencias');
        //         this.salas = [];
        //         this.getToast('ADVERTENCIA:', 'Aun NO hay reservas para esta Sala...', null);
        //       }
        //      });

        // }
        if (this.route.snapshot.params.room !== undefined) {

          this.reservaService
            .getReservasBySala(this.route.snapshot.params.room)
            .subscribe(responseAux => {
              console.log('RESPONSEAUX', responseAux);
                this.currentSala.reservas = responseAux;
                  this.currentSala.reservas.forEach(e => {
                    const dateinicio = new Date(this.convertHoras(e.fecha)
                    + ' ' +  e.horaDesde);
                    const datefin = new Date(this.convertHoras(e.fecha)
                    + ' ' +  e.horaHasta);
                   console.log('parseo', dateinicio);
                    const el = {
                      start: dateinicio,
                      title: e.asunto,
                      end: datefin,
                    };
                    console.log('ELEMENTO', el);

                    this.events.push(el);
                  });
            });

       }
      }

      getToast(info, mensaje, action) {
        const message = `${info} ${mensaje}`;
        const toastStr = `<span>${message}</span>`;
        toast(toastStr, 7000, action);
      }

      convertHoras(str) {
        return str.split('-').reverse().join('-');
      }

      restarHoras(reservaAuxList) {
        reservaAuxList.forEach(item => {
          const horaInicioReservas = 8 * 60;

          const horaInicioBegin = 0;
          const horaInicioMiddle = item.horaDesde.indexOf(':');
          const horaInicioEnd = item.horaDesde.length;

          const horaInicio = item.horaDesde.substr(
            horaInicioBegin,
            horaInicioMiddle
          );
          const minInicio = item.horaDesde.substr(
            horaInicioMiddle + 1,
            horaInicioEnd
          );

          let horas = parseInt(horaInicio, 10) * 60;
          let minutos = parseInt(minInicio, 10);
          const inicioMinutos = horas + minutos;

          const minutoDesde = inicioMinutos - horaInicioReservas;

          const horaFinBegin = 0;
          const horaFinMiddle = item.horaHasta.indexOf(':');
          const horaFinEnd = item.horaHasta.length;

          const horaFin = item.horaHasta.substr(horaFinBegin, horaFinMiddle);
          const minFin = item.horaHasta.substr(horaFinMiddle + 1, horaFinEnd);

          horas = parseInt(horaFin, 10) * 60;
          minutos = parseInt(minFin, 10);
          const finMinutos = horas + minutos;

          const duracion = finMinutos - inicioMinutos;

          item.minutodesde = minutoDesde;
          item.duracion = duracion;
        });

        return reservaAuxList;
      }

     clickButton(model: any) {
       console.log('Modl', model);
       // this.events = model;
        this.loadEvents();
      }
    // eventClick(model: any) {
    //   model = {
    //     event: {
    //       id: model.event.id,
    //       start: model.event.start,
    //       end: model.event.end,
    //       title: model.event.title,
    //       allDay: model.event.allDay
    //       // other params
    //     },
    //     duration: {}
    //   }
    //   this.displayEvent = model;
    // }
    // updateEvent(model: any) {
    //   model = {
    //     event: {
    //       id: model.event.id,
    //       start: model.event.start,
    //       end: model.event.end,
    //       title: model.event.title
    //       // other params
    //     },
    //     duration: {
    //       _data: model.duration._data
    //     }
    //   }
    //   this.displayEvent = model;
    // }

}
