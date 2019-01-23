import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toast } from 'angular2-materialize';
import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { ConfirmationPopup } from '../confirmation-popup/confirmation-popup.model';
import { OficinaService } from '../service/oficina.service';
import { ReservaService } from '../service/reserva.service';
import { SalaService } from '../service/sala.service';
import { SharedService } from '../service/shared.service';
import { Oficina } from '../_data/oficina.model';
import { Reserva } from '../_data/reserva.model';
import { Sala } from '../_data/sala.model';



@Component({
  selector: 'app-dashboard-salas',
  templateUrl: './dashboard-salas.component.html',
  styleUrls: ['./dashboard-salas.component.scss']
})
export class DashboardSalasComponent implements OnInit {
  public hours: Array<string> = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00'
  ];

  private showSala: Boolean = false;
  @Input() confirmationPopup = new ConfirmationPopup();

  public currentDate = '';

  public currentOficina = new Oficina();

  public currentSala = new Sala();

  public currentReserva = new Reserva();

  public salas = new Array<Sala>();

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private oficinaService: OficinaService,
    private reservaService: ReservaService,
    private salaService: SalaService
  ) { }

  ngOnInit() {
    this.showNavbar();
    this.sharedService.currentOficina.idOficina = + this.route.snapshot.params.office;

    this.sharedService.getCurrentOficina$().subscribe(currentOficina => {
      this.currentOficina = currentOficina;
      this.loadSalas();
    });

    this.sharedService.getCurrentDate$().subscribe(currentDate => {
      this.currentDate = currentDate;
      this.loadSalas();
    });
    this.loadSalas();

    this.sharedService.getCurrentSala$().subscribe(currentSala => {
      this.currentSala = currentSala;
    });

    this.sharedService.getCurrentReserva$().subscribe(currentReserva => {
      this.currentReserva = currentReserva;
    });


    if (this.route.snapshot.params.room !== undefined) {

      this.reservaService
        .getReservasBySalaAndDate(
          this.route.snapshot.params.room,
          this.sharedService.currentDate
        )
        .subscribe(responseAux => {
          if (
            responseAux.result === 'Success' &&
            responseAux.mensaje === 'Success'
          ) {
            this.restarHoras(responseAux.reservaAuxList);
            this.currentSala.reservas = responseAux.reservaAuxList;
            this.salas.forEach(e => {
              if (e.idSala === +this.route.snapshot.params.room) {
                this.salas = [];
                this.salas.push(e);
              }
            });
          } else {
            console.log('No ha habido coincidencias');
            this.salas = [];
            this.getToast('ADVERTENCIA:', 'Aun NO hay reservas para esta Sala...', 'yellow');
          }
        });

    } else {
      this.sharedService.getSalas$().subscribe(salas => {
        this.salas = salas;
        // loads reservas of each sala
        if (!(salas instanceof Observable)) {
          salas.forEach(sala => {

            if (sala.idSala !== undefined) {
              this.reservaService
                .getReservasBySalaAndDate(
                  sala.idSala,
                  this.sharedService.currentDate
                )
                .subscribe(responseAux => {
                  if (
                    responseAux.result === 'Success' &&
                    responseAux.mensaje === 'Success'
                  ) {
                    this.restarHoras(responseAux.reservaAuxList);
                    sala.reservas = responseAux.reservaAuxList;
                  }
                });
            }
          });
        }
      });
    }
    this.currentSala.idSala = +this.route.snapshot.params.room;
  } ////////////////////// ngOnInit()

  cerrarModalSala() {
    this.showSala ? (this.showSala = false) : (this.showSala = true);
  }
  modalDatosSala(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    // this.nSala = target.attributes.id.nodeValue;
    this.showSala ? (this.showSala = false) : (this.showSala = true);
  }

  loadSalas() {
    // cargamos la sala
    if (this.currentOficina.idOficina !== undefined) {
      this.oficinaService
        .getSalasByOficina(+this.currentOficina.idOficina)
        .subscribe(salas => {
          this.sharedService.updateSalas(salas);
          this.oficinaService.updateSalaList(salas);
        });
    }
  }

  closeConfirmation() {
    this.loadSalas();
    // closes confirmation
    this.confirmationPopup.active = false;
  }

  accept() {
    // save/delete call
    if (
      this.confirmationPopup.action === 'save' &&
      !this.currentReserva.periodic
    ) {
      this.reservaService
        .insertOrUpdateReserva(this.currentReserva)
        .subscribe(response => {
          this.getToast('', response.mensaje, response.result);

          this.closeConfirmation();
        });
    } else if (
      this.confirmationPopup.action === 'save' &&
      this.currentReserva.periodic
    ) {
      this.getToast('', 'Insertando reservas...', 'blue');
      this.reservaService
        .insertOrUpdateReservas(this.currentReserva)
        .subscribe(response => {
          this.getToast('', response.mensaje, response.result);

          this.closeConfirmation();
        });
    } else if (this.confirmationPopup.action === 'delete') {
      this.reservaService
        .deleteReserva(this.currentReserva.idReserva)
        .subscribe(response => {
          this.getToast('', response.mensaje, response.result);

          this.closeConfirmation();
        });
    } else {
      this.closeConfirmation();
    }
  }

  cancel() {
    // closes confirmation
    this.confirmationPopup.active = false;
  }

  newReserva() {
    this.salaService.idSala = 0;
    this.sharedService.updateCurrentReserva(null, +this.route.snapshot.params.office);
  }

  showNavbar() {
    // gets the navbar element
    $('#app-nav-bar').css('display', 'block');
    $('.search-icon.button-collapse').css('visibility', 'visible');
  }

  getToast(info, mensaje, action) {
    const message = `${info} ${mensaje}`;
    const toastStr = `<span>${message}</span>`;
    toast(toastStr, 7000, action);
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
}
