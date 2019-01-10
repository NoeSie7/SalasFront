import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ConfirmationPopup } from '../../confirmation-popup/confirmation-popup.model';
import { Reserva } from '../../_data/reserva.model';
import { Sala } from '../../_data/sala.model';
import { SharedService } from '../../service/shared.service';
import { ReservaService } from '../../service/reserva.service';
import * as $ from 'jquery';
import { SalaService } from '../../service/sala.service';

@Component({
  selector: 'app-reserva-item',
  templateUrl: './reserva-item.component.html',
  styleUrls: ['./reserva-item.component.scss']
})
export class ReservaItemComponent implements OnInit {

  @Input() confirmationPopup: ConfirmationPopup;
  @Output() confirmationPopupChange = new EventEmitter<ConfirmationPopup>();

  @Input() currentSala: Sala;
  @Input() currentReserva: Reserva;
  @Input() indice: number;
  @Input() indiceSala: number;

  constructor(private sharedService: SharedService,
    private reservaService: ReservaService, private salaService: SalaService) {
    this.currentReserva = new Reserva();
  }

  ngOnInit() {
  }

  view() {
    // sets currentSala and currentReserva
    this.sharedService.updateCurrentSala(this.currentSala);
    this.sharedService.updateCurrentReserva(this.currentReserva);
  }

  edit() {
    console.log('edit()');
    // this.sharedService.isConsulting = false;
    // sets currentSala and currentReserva
    this.sharedService.updateCurrentSala(this.currentSala);
    // recollo o valor do id sala
    this.sharedService
    .getCurrentSala$()
    .map(sala => sala.idSala)
    .subscribe(x => {
      this.salaService.idSala = x;
    }
    ).unsubscribe();
    this.sharedService.updateCurrentReserva(this.currentReserva);
  }

  getReservaWidth() {
    const num = 0.131;
    return (this.currentReserva.duracion * num) + '%';
  }

  getReservaMargin() {
    return (this.currentReserva.minutoDesde);
  }

  getReservaColor() {
    // tslint:disable-next-line:max-line-length   Math.floor(Math.random() * 16)
    // color Par
    const colorsEven = ['#1a237e', '#ef5350', '#c62828', '#ec407a', '#ab47bc', '#7e57c2', '#5c6bc0', '#42a5f5', '#29b6f6', '#26c6da', '#26a69a', '#66bb6a', '#9ccc65', '#d4e157', '#ffee58', '#ffca28', '#ffa726', '#ff7043', '#aa00ff', '#6a1b9a'];
    // color Impar
    const colorsOdd = ['#6a1b9a', '#aa00ff', '#ff7043', '#ffa726', '#ffca28', '#ffee58', '#d4e157', '#9ccc65', '#66bb6a', '#26a69a',
    '#26c6da', '#29b6f6', '#42a5f5', '#5c6bc0', '#7e57c2', '#ab47bc', '#ec407a', '#c62828', '#ef5350', '#1a237e'];

    let color = '';
    // Si el indice que se pasa es > que el array de colores. Al indice le restamos,
    // la multiplicación del cociente de la división del indice entre el total de colores, por el total de colores
    // if (this.indice > colorsEven.length) {
    //   const i = this.indice - ((this.indice / colorsEven.length) * colorsEven.length);
    //   // si es par, es divisible por 2
    //   if ((this.indiceSala % 2) === 0) {
    //     color = colorsEven[i];
    //   } else {
    //     color = colorsOdd[i];
    //   }
    // } else {
    //   // Si no supera el total de colores, coprobamos si es par o impar.
    //   if ((this.indiceSala % 2) === 0) {
    //     color = colorsEven[this.indice];
    //   } else {
    //     color = colorsOdd[this.indice];
    //   }
    // }
    let index = this.indice;
    if(index > colorsEven.length){
      index = this.indice - ((this.indice / colorsEven.length) * colorsEven.length);
    }
    color = (this.indiceSala % 2) === 0 ? colorsEven[index]: colorsOdd[index];
    return color;
  }
}
