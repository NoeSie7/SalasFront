import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Oficina } from '../../../components/_data/oficina.model';
import { OficinaService } from '../../../components/service/oficina.service';
import { SharedService } from '../../../components/service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  public oficinas: Oficina[];
  public filter: Oficina = new Oficina();
  @Input() searchDateInput = '';
  @Input() searchOficinaInput = '';
  public resultsEnable = false;

  public currentOficina = new Oficina();
  public currentOficina$: Observable<Oficina>;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private oficinaService: OficinaService) {

    const date = new Date();
    this.searchDateInput = date.toISOString().substr(0, 10);
    this.searchOficinaInput = this.currentOficina.nombreOficina;
    this.oficinas = new Array<Oficina>();
  }

  ngOnInit() {
    // loads oficinas from the oficinas service on init
    this.oficinaService.getOficinas().subscribe(
      (data: Oficina[]) => {
        this.oficinas = data;
      });

    this.currentOficina$ = this.sharedService.getCurrentOficina$();
    this.sharedService.getCurrentOficina$()
      .subscribe(currentOficina => {
        this.currentOficina = currentOficina;
        this.searchOficinaInput = this.currentOficina.nombreOficina;
      });
  }

  onSearch() {
    this.filter.nombreOficina = this.searchOficinaInput;
    this.resultsEnable = this.searchOficinaInput.length > 0;
  }

  selectOficina(idOficina) {
    // gets selected oficina and set it as current
    this.resultsEnable = false;
    const selectedOficina = this.oficinas.find(x => x.idOficina === idOficina);
    this.searchOficinaInput = selectedOficina.nombreOficina;
    this.sharedService.updateCurrentOficina(selectedOficina);
    // updates salas
    const salas = this.oficinaService.getSalasByOficina(selectedOficina.idOficina);
    this.oficinaService.updateSalaList(salas);
    this.sharedService.updateSalas(salas);
  }

  searchDateInputChange() {
    // gets selected date from input
    this.searchDateInput = document.getElementById('search-date-input').getAttribute('value');
    // formats date for service
    // let formatedDate = this.searchDateInput.split('/').reverse().join('-');
    // updates current selected date in service in order to update salas view
    this.sharedService.updateCurrentDate(this.searchDateInput);
  }

  isLocation(): boolean {
    if (window.location.pathname === '/') { return false; }
    return true;
  }
  openSearch() {
    document.getElementById('search-index-input').focus();
    this.filter.nombreOficina = '';
  }
}
