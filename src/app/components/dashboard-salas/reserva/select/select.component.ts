import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import { OficinaService } from '../../../service/oficina.service';
import { SalaService } from '../../../service/sala.service';
import {ReservaComponent} from '../../reserva/reserva.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() nombreControlForm: string;

  private flagClass: Boolean = false;
  private showSelect: Boolean = false;
  private nombreSelect: String = 'Selecciona una sala';
  @Output() valorSelect = new EventEmitter<number>();

  constructor(private oficinaService: OficinaService, private salaService: SalaService, private reservaComponent: ReservaComponent) {
    this.salaService.idSala$.subscribe(id => {
      const idSalaChange = id;
      if (idSalaChange !== 0) {
        const filtered = this.oficinaService.salasList.filter(sal => sal.idSala === idSalaChange);
        this.nombreSelect = filtered.map(x => x.nombre)[0];
        this.valorSelect.emit(idSalaChange);
      } else {
        this.nombreSelect = 'Selecciona una sala';
      }
    }
    );
  }

  clickSelect() {
    this.cambiarFlag();
  }

  clickSelectLi(result) {
    this.cambiarFlag();
    // console.log('Seleccionado', result);
    console.log(`Click Select ${result.idSala}`);
    this.nombreSelect = result.nombre;
    this.valorSelect.emit(result.idSala);

    if(this.reservaComponent.ckeckReservaDesdeHasta()) {
      this.reservaComponent.currentReservationData();
      this.reservaComponent.flag = true;
    }

  }
  private cambiarFlag() {
    this.flagClass ? this.flagClass = false : this.flagClass = true;
    this.showSelect ? this.showSelect = false : this.showSelect = true;
  }
}
