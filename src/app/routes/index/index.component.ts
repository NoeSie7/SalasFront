import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Oficina } from '../_data/oficina.model';
import { OficinaService } from '../service/oficina.service';
import { SharedService } from '../service/shared.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public oficinas: Oficina[];
  public filter: Oficina = new Oficina();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private oficinaService: OficinaService) {
    this.oficinas = new Array<Oficina>();
  }

  ngOnInit() {
    this.hideNavbar();

    // loads oficinas from the oficinas service on init
    this.oficinaService.getOficinas().subscribe(
      (data: Oficina[]) => {
        this.oficinas = data;
      });
  }

  openOficina(idOficina) {
    // gets selected oficina and set it as current
    const selectedOficina = this.oficinas.find(x => x.idOficina === idOficina);
    this.oficinaService.currentOficina = selectedOficina;
    this.sharedService.updateCurrentOficina(selectedOficina);
    // redirects to salas module
    this.router.navigate(['./salas']);
  }

  hideNavbar() {
    // gets the navbar element
    $('#app-nav-bar').css('display','none');
    $('.search-icon.button-collapse').css('visibility', 'hidden');
  }
}
