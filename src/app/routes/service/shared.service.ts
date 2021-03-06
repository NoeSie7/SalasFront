import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Oficina } from "../_data/oficina.model";
import { Sala } from "../_data/sala.model";
import { Reserva } from "../_data/reserva.model";

@Injectable()
export class SharedService {

  public currentDate: string;
  private currentDate$: BehaviorSubject<string>;

  public currentHoraDesde: string;
  private currentHoraDesde$: BehaviorSubject<string>;

  public currentHoraHasta: string;
  private currentHoraHasta$: BehaviorSubject<string>;

  public currentOficina: Oficina;
  private currentOficina$: BehaviorSubject<Oficina>;

  public currentSala: Sala;
  private currentSala$: BehaviorSubject<Sala>;

  public currentReserva: Reserva;
  private currentReserva$: BehaviorSubject<Reserva>;

  public salas: Sala[];
  private salas$: BehaviorSubject<Sala[]>;

  // public isConsulting: boolean;

  constructor() {

    // this.isConsulting = false;

    let date = new Date();
    this.currentDate = this.customFormatter(date);
    this.currentDate$ = new BehaviorSubject(this.currentDate);
    this.emitCurrentDate();

    this.currentHoraDesde = date.toTimeString().substr(0,5);
    this.currentHoraDesde$ = new BehaviorSubject(this.currentHoraDesde);
    this.emitCurrentHoraDesde();

    this.currentHoraHasta = date.toTimeString().substr(0,5);
    this.currentHoraHasta$ = new BehaviorSubject(this.currentHoraHasta);
    this.emitCurrentHoraHasta();

    this.currentOficina = new Oficina();
    this.currentOficina$ = new BehaviorSubject(this.currentOficina);
    this.emitCurrentOficina();

    this.currentSala = new Sala();
    this.currentSala$ = new BehaviorSubject(this.currentSala);
    this.emitCurrentSala();

    this.currentReserva$ = new BehaviorSubject(this.currentReserva);
    this.emitCurrentReserva();

    this.salas = new Array<Sala>();
    this.salas$ = new BehaviorSubject(this.salas);
    this.emitSalas();
  }

  private emitCurrentDate() {
    this.currentDate$.next(this.currentDate);
  }

  private emitCurrentHoraDesde() {
    this.currentHoraDesde$.next(this.currentHoraDesde);
  }

  private emitCurrentHoraHasta() {
    this.currentHoraHasta$.next(this.currentHoraHasta);
  }

  private emitCurrentOficina() {
    this.currentOficina$.next(this.currentOficina);
  }

  private emitCurrentSala() {
    this.currentSala$.next(this.currentSala);
  }

  private emitCurrentReserva() {
    this.currentReserva$.next(this.currentReserva);
  }

  private emitSalas() {
    this.salas$.next(this.salas);
  }

  getCurrentDate$(): Observable<string> {
    return this.currentDate$.asObservable();
  }

  getCurrentHoraDesde$(): Observable<string> {
    return this.currentHoraDesde$.asObservable();
  }

  getCurrentHoraHasta$(): Observable<string> {
    return this.currentHoraHasta$.asObservable();
  }

  getCurrentOficina$(): Observable<Oficina> {
    return this.currentOficina$.asObservable();
  }

  getCurrentSala$(): Observable<Sala> {
    return this.currentSala$.asObservable();
  }

  getCurrentReserva$(): Observable<Reserva> {
    return this.currentReserva$.asObservable();
  }

  getSalas$(): Observable<Sala[]> {
    return this.salas$.asObservable();
  }

  updateCurrentDate(date) {
    if (!date) {
      date = new Date();
      date = date.toISOString().substr(0, 10);
    }
    this.currentDate = date;
    this.emitCurrentDate();
  }

  updateStartHour(horaDesde) {
    if (!horaDesde) {
      horaDesde = new Date().toLocaleTimeString().substr(0, 5);
    }
    this.currentHoraDesde = horaDesde;
    this.emitCurrentHoraDesde();
  }

  updateEndHour(horaHasta) {
    if (!horaHasta) {
       horaHasta = new Date().toLocaleTimeString().substr(0, 5);
    }
    this.currentHoraHasta = horaHasta;
    this.emitCurrentHoraHasta();
  }

  updateCurrentOficina(oficina) {
    this.currentOficina = oficina;
    this.emitCurrentOficina();
  }

  updateCurrentSala(sala) {
    this.currentSala = sala;
    this.emitCurrentSala();
  }

  updateCurrentReserva(reserva) {
    if (reserva == null && this.currentSala != null) {
      reserva = new Reserva();
      reserva.idSala = 0;
      reserva.fecha = this.getCurrentDate();
      reserva.horaDesde = this.getCurrentHoraDesde();
      reserva.horaHasta = this.getCurrentHoraHasta();
    } else {
      if (reserva != null) {
        this.setCurrentHoraDesde(reserva.horaDesde);
        this.setCurrentHoraHasta(reserva.horaHasta);
      }
    }
    // reserva.fecha = this.getCurrentDateForHtml();
    // reserva.horaDesde = this.getCurrentHoraDesde();
    // reserva.horaHasta = this.getCurrentHoraHasta();
    this.currentReserva = reserva;
    this.emitCurrentReserva();
  }

  updateSalas(salas) {
    this.salas = salas;
    this.emitSalas();
  }

  getCurrentDate() {
    return this.currentDate;
  }

  setCurrentDate(fecha) {
    this.currentDate = fecha;
  }
 
  // getDateForHtml(date) {
  //   return date.split('-').reverse().join('/');
  // }

  // getCurrentDateForHtml() {
  //   return this.getCurrentDate().split('-').reverse().join('/');
  // }

  getCurrentHoraDesde() {
    return this.currentHoraDesde;
  }

  getCurrentHoraHasta() {
    return this.currentHoraHasta;
  }

  setCurrentHoraDesde(horaDesde) {
    this.currentHoraDesde = horaDesde;
  }

  setCurrentHoraHasta(horaHasta) {
    this.currentHoraHasta = horaHasta;
  }

  private customFormatter(date: Date): string {
    let year = date.getFullYear();
    let monthNumber = date.getMonth() + 1;
    let monthString = monthNumber < 10 ? `0${monthNumber}`: `${monthNumber}`
    let dayNumber = date.getUTCDate();
    let dayString = dayNumber < 10 ? `0${dayNumber}`: `${dayNumber}`

    return `${dayString}/${monthString}/${year}`;
  }
}