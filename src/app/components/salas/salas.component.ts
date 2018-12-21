import { Component, OnInit } from '@angular/core';
import { OficinaService} from '../service/oficina.service';
import { SharedService } from '../service/shared.service';
import { Oficina } from '../_data/oficina.model';
import { ActivatedRoute } from '@angular/router';
import { Sala } from '../_data/sala.model';



@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.scss']
})
export class SalasComponent implements OnInit {

  public currentOficina = new Oficina();
  public id: Number;
  public salas = new Array<Sala>();

  constructor(private oficinaService: OficinaService, private sharedService: SharedService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      console.log(params);
      this.id = params.id;
    });

    this.oficinaService.getSalasByOficina(this.id) // this.currentOficina.idOficina
    .subscribe(salas => {
      console.log('SALAS', salas);
      this.salas = salas;
      this.sharedService.updateSalas(salas);
      this.oficinaService.updateSalaList(salas);
    });
  }

}
