import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toast } from 'angular2-materialize';
import { OptionsInput, log } from 'fullcalendar';
import * as $ from 'jquery';
// import moment = require('moment');
import * as moment from 'moment';
import { CalendarComponent } from 'ng-fullcalendar';
import { Observable } from 'rxjs';
import { OficinaService } from '../service/oficina.service';
import { ReservaService } from '../service/reserva.service';
import { Sala } from '../_data/sala.model';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  private calendarOptions: OptionsInput;
  private date: Date;
  private events = [];
  private newEvents = [];

  private seconds = 60;

  public currentSala = new Sala();
  public currentSala$: Observable<Sala>;


  public salas = new Array<Sala>();
  public salas$: Observable<Sala[]>;
  public numberroom: Number;


  private calendario: JQuery<HTMLElement>;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  constructor(private route: ActivatedRoute,
    private reservaService: ReservaService,
    private oficinaService: OficinaService) { }

  ngOnInit() {
    this.calendario = $('ng-fullcalendar');
    this.calendarOptions = {
      height: 'auto',
      titleFormat: 'DD/MM/YYYY',
      editable: false,
      eventLimit: true,
      header: {
        left: '',
        center: 'title',
        right: ''
        // right: 'month,agendaWeek,agendaDay,listMonth, basicWeek'
      },
      footer: {
        center: 'prev,next',
      },
      businessHours: {
        dow: [1, 2, 3, 4, 5],
        start: moment.duration('08:00:00'),
        end: moment.duration('19:00:00')
      },
      allDaySlot: false, // elimina casilla de alldays
      weekends: false,
      events: this.events,
      defaultView: 'agendaWeek',
      locale: 'es', // Idioma del calendario
      minTime: moment.duration('07:00:00'), // Duracion generica del calendario
      maxTime: moment.duration('20:00:00'),
    };
    setTimeout(() => {
      this.loadEvents();
    }, 100);
    setInterval(() => this.loadEvents(), this.seconds * 1000);
  }

  loadEvents() {
    this.newEvents = [];
    this.numberroom = this.route.snapshot.params.room;

    this.oficinaService.getSalasByOficina(this.route.snapshot.params.office).subscribe(res => {
      this.salas = res;
    });

    if (this.route.snapshot.params.room !== undefined) {
      this.reservaService.getReservasBySala(this.route.snapshot.params.room).subscribe(responseAux => {
        this.currentSala.reservas = responseAux;
        this.currentSala.reservas.forEach(e => {
          const el = {
            start: new Date(`${this.convertHoras(e.fecha)} ${e.horaDesde}`),
            title: `${e.asunto}\t\t\t(${e.usuario.nombre})`,
            end: new Date(`${this.convertHoras(e.fecha)} ${e.horaHasta}`),
          };
          this.newEvents.push(el);
        });
        this.renderEvents();
      });
    }
  }

  renderEvents() {
    // Filtra los eventos que no estan en el array devuelto por el servidor
    const eventsToRemove = this.events.filter(e => this.newEvents.find(y => JSON.stringify(y) === JSON.stringify(e)) === undefined );

    // Filtra los eventos que no estan en el array local
    const eventsToAdd = this.newEvents.filter(e => this.events.find(y => JSON.stringify(y) === JSON.stringify(e)) === undefined );

    // Actualiza el array local
    this.events = this.events.concat(eventsToAdd);
    eventsToRemove.forEach(e => {
      const i = this.events.findIndex(y => JSON.stringify(y) === JSON.stringify(e));
      this.events.splice(i, 1);
    });

    // Dibuja el calendario
    this.calendario.fullCalendar('renderEvents', eventsToAdd);
    this.calendario.fullCalendar('removeEvents', eventsToRemove);
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
    this.loadEvents();
  }
}
