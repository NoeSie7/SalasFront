import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toast } from "angular2-materialize";
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { FormsToolsService } from '../../../core/shared/forms/forms-tools.service';
import { ValidatorsService } from '../../../core/shared/forms/validators.service';
import { ConfirmationPopup } from '../../confirmation-popup/confirmation-popup.model';
import { OficinaService } from '../../service/oficina.service';
import { ReservaService } from '../../service/reserva.service';
import { SharedService } from '../../service/shared.service';
import { UsuarioService } from '../../service/usuario.service';
import { Oficina } from '../../_data/oficina.model';
import { Reserva } from '../../_data/reserva.model';
import { Sala } from '../../_data/sala.model';
import { Usuario } from '../../_data/usuario.model';


@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
})
export class ReservaComponent implements OnInit {

  private valorSelect: number;
  @Input() confirmationPopup: ConfirmationPopup;
  @Output() confirmationPopupChange = new EventEmitter<ConfirmationPopup>();
  @Output() public acceptEmiter: EventEmitter<any> = new EventEmitter<any>();
  @Output() public cancelEmiter: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentOficina: Oficina;
  public currentOficina$: Observable<Oficina>;
  @Input() currentSala: Sala;
  public currentSala$: Observable<Sala>;
  @Input() currentReserva: Reserva;
  public currentReserva$: Observable<Reserva>;

  public reservaForm: FormGroup;
  public usuariosList: Usuario[];

  @Input() searchDateReservaInput = '';
  @Input() currentHoraDesde = '';
  public currentHoraDesde$: Observable<string>;
  @Input() currentHoraHasta = '';

  public flag = true;

  constructor(
    public formBuilder: FormBuilder,
    public validatorsService: ValidatorsService,
    public toolService: FormsToolsService,
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private reservaService: ReservaService,
    private oficinaService: OficinaService) {

    // initialize variables
    this.usuariosList = new Array<Usuario>();
    this.searchDateReservaInput = this.getDateForHtml();
    this.currentHoraDesde = this.getHoraDesde();
    this.currentHoraHasta = this.getHoraHasta();
  }

  ngOnInit() {
    // this.oficinaService.salasList = [
    //       {
    //         "idSala": 3,
    //         "idOficina": 1,
    //         "nombre": "Sala 3",
    //         "plazas": "25",
    //         "detalle": "Ourense - Sala 3",
    //         "reservas":[]
    //       }];


    this.currentOficina$ = this.sharedService.getCurrentOficina$();
    this.sharedService.getCurrentOficina$()
      .subscribe(currentOficina => {
        this.currentOficina = currentOficina;
      });

    this.currentSala$ = this.sharedService.getCurrentSala$();
    this.sharedService.getCurrentSala$()
      .subscribe(currentSala => {
        this.currentSala = currentSala;
      });

    this.currentReserva$ = this.sharedService.getCurrentReserva$();
    this.sharedService.getCurrentReserva$()
      .subscribe(currentReserva => {
        this.currentReserva = currentReserva;
        // rebuilds form with currentReserva changed
        if (this.currentReserva != null) {
          this.buildForm();
        }
      });
    // builds form controls
    this.buildForm();

    if (this.valorSelect == undefined)
      this.valorSelect = this.currentReserva.idSala;
  }

  ngDoCheck() {
    /*if((this.currentHoraDesde!="") && (this.currentHoraHasta!="")) {
      this.currentReserva.idSala = 3;
      this.sharedService.checkAvailability(this.currentReserva);
    }*/
  }

  valorSelected(valor: number) {
    this.valorSelect = valor;
    this.reservaForm.get('idSala').setValue(valor);
    if((this.currentHoraDesde != "") && (this.currentHoraHasta != "")) {

      this.currentReservationData();
    }
    this.flag = true;
  }
  buildForm() {
    // initialize form controls
    const controls = this.initControls();
    this.reservaForm = this.formBuilder.group(controls);
    // loads form values
    this.loadForm(this.currentReserva);
  }

  initControls() {
    const controls = {
      idReserva: [
        this.currentReserva.idReserva
      ],
      idSala: [
        this.currentReserva.idSala
      ],
      idUsuario: [
        this.currentReserva.usuario.idUsuario
      ],
      nombreUsuario: [
        this.currentReserva.usuario.nombre,
        Validators.required
      ],
      email: [
        this.currentReserva.usuario.email,
        [Validators.required, this.validatorsService.formatemail]
      ],
      periodic: [
        this.currentReserva.periodic
      ],
      periodicTime:[
        this.currentReserva.periodicTime
      ],
      extension: [
        this.currentReserva.usuario.extension
      ],
      fecha: [
        this.currentReserva.fecha,
        Validators.required
      ],
      horaDesde: [
        this.currentReserva.horaDesde,
        Validators.required
      ],
      horaHasta: [
        this.currentReserva.horaHasta,
        Validators.required
      ],
      asunto: [
        this.currentReserva.asunto
      ]
    };
    return controls;

  }

  loadForm(reserva: Reserva) {
    console.log('loadForm -> ', reserva);
    // console.log('2 SAAAAAAAAAAAALAAAAAAAAAAAAAS:' + JSON.stringify(this.salas));
    // this.loadSalas();
    // let formatedDate = '';
    // if (reserva.fecha != null) {
    //   if (reserva.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
    //     formatedDate = reserva.fecha;
    //   } else {
    //     formatedDate = reserva.fecha.split('-').reverse().join('-');
    //     // reserva.fecha = formatedDate;
    //   }
    // }

    if (reserva.idReserva) {
      this.reservaForm.setValue({
        idReserva: reserva.idReserva,
        idSala: reserva.idSala,
        idUsuario: reserva.usuario.idUsuario,
        nombreUsuario: reserva.usuario.nombre,
        email: reserva.usuario.email,
        extension: reserva.usuario.extension != null ? reserva.usuario.extension : '',
        fecha: reserva.fecha,
        periodic: reserva.periodic,
        periodicTime: reserva.periodicTime,
        horaDesde: reserva.horaDesde,
        horaHasta: reserva.horaHasta,
        asunto: reserva.asunto != null ? reserva.asunto : 'Reserva de sala'
      });
    }
  }

  getFormData(form): Reserva {
    const retVal = new Reserva();
    retVal.idReserva = this.reservaForm.get('idReserva').value;
    retVal.idSala = this.reservaForm.get('idSala').value;
    retVal.usuario.idUsuario = this.reservaForm.get('idUsuario').value;
    retVal.usuario.nombre = this.reservaForm.get('nombreUsuario').value;
    retVal.usuario.email = this.reservaForm.get('email').value;
    retVal.usuario.extension = this.reservaForm.get('extension').value;
    retVal.fecha = this.reservaForm.get('fecha').value;
    if(this.reservaForm.get('periodic').value){
    retVal.periodic = true;    
    retVal.periodicTime = this.reservaForm.get('periodicTime').value;
    }else{
      retVal.periodic = false;
      retVal.periodicTime = 0;
    }
    retVal.horaDesde = this.reservaForm.get('horaDesde').value;
    retVal.horaHasta = this.reservaForm.get('horaHasta').value;
    retVal.asunto = this.reservaForm.get('asunto').value;
    return retVal;
  }

  // getDateHtmlToRest(fecha) {
  //   if (fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
  //     return fecha.split('/').reverse().join('-');
  //   }
  //   if (fecha.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
  //     return fecha.split('/').reverse().join('-');
  //   }
  //   if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
  //     return fecha.split('-').reverse().join('-');
  //   }
  // }

  loadUsuariosList() {
    this.selectUsuario(null);
    // calls the service when writing 3 or more characters
    if (this.reservaForm.value.nombreUsuario.length < 3) {
      this.usuariosList = new Array<Usuario>();
      return;
    }
    this.usuarioService.getUsuariosByNombre(this.reservaForm.value.nombreUsuario).subscribe(
      (data: Usuario[]) => {
        this.usuariosList = data;
      });
  }

  selectUsuario(idUsuario) {
    if (idUsuario == null) { // if idUsuario is null resets usuario's fields
      this.reservaForm.patchValue({
        idUsuario: null,
        email: '',
        extension: ''
      });
    } else { // else searches selected usuario
      const selectedUsuario = this.usuariosList.find(x => x.idUsuario === idUsuario);
      // refresh form values
      this.reservaForm.patchValue({
        idUsuario: selectedUsuario.idUsuario,
        nombreUsuario: selectedUsuario.nombre,
        email: selectedUsuario.email,
        extension: selectedUsuario.extension
      });
      let lblEmail = document.getElementById("lblemail");
      lblEmail.className += " active";
      let lblExtension = document.getElementById("lblextension");
      lblExtension.className += " active";
      let lblEmpleado = document.getElementById("lblempleado");
      lblEmpleado.className += " active";
    }
    this.usuariosList = new Array<Usuario>();
  }

  save() {
    // updates reserva object with form data
    this.currentReserva = this.getFormData(this.reservaForm.value);
    this.sharedService.updateCurrentReserva(this.currentReserva);
    if (this.currentReserva.idSala === 0) {
      // opens confirmation dialog
      const confirmation = new ConfirmationPopup();
      confirmation.title = 'Faltan datos';
      confirmation.message = 'No ha seleccionado la sala';
      confirmation.action = '';
      confirmation.active = false;
      this.confirmationPopupChange.emit(confirmation);
    }else if(this.currentReserva.periodic && (this.currentReserva.periodicTime >10 || this.currentReserva.periodicTime <=0 || this.currentReserva.periodicTime == null)){
      //opens confirmation dialog
      const confirmation = new ConfirmationPopup();
      confirmation.title = 'Reserva Periodica incorrecta';
      confirmation.message = 'Inserte la repeticion de la reserva hasta un máximo de 10 dias laborables';
      confirmation.action = '';
      confirmation.active = false;
      this.confirmationPopupChange.emit(confirmation);
    }else {
      // opens confirmation dialog
      const confirmation = new ConfirmationPopup();
      confirmation.title = 'Confirmación de reserva';
      confirmation.message = '¿Está seguro que desea guardar los cambios?';
      confirmation.action = 'save';
      confirmation.active = true;
      
      this.confirmationPopupChange.emit(confirmation);
    }
  }
  
    delete() {
      // this.sharedService.isConsulting = false;
      // updates reserva object with selected
      this.sharedService.updateCurrentReserva(this.currentReserva);
      // opens confirmation dialog
      const confirmation = new ConfirmationPopup();
      confirmation.title = 'Eliminación de reserva';
      confirmation.message = '¿Está seguro que desea eliminar la reserva?';
      confirmation.action = 'delete';
      confirmation.active = true;
      this.confirmationPopupChange.emit(confirmation);
    }
   

  getCurrentDate() {
    return this.sharedService.getCurrentDate();
  }

  getDateForHtml() {
    return this.sharedService.getCurrentDate();
  }

  getHoraDesde() {
    return this.sharedService.getCurrentHoraDesde();
  }

  getHoraHasta() {
    return this.sharedService.getCurrentHoraHasta();
  }

  searchDateChange() {
    this.searchDateReservaInput = document.getElementById('search-date-reserva-input').getAttribute('value');
    this.sharedService.updateStartHour(this.searchDateReservaInput);

  }
  getToast(info, mensaje, action) {
    const message = `${info} ${mensaje}`;
    const toastStr = `<span>${message}</span>`;
    toast(toastStr, 3000, action); 
  }

  currentReservationData() {
    this.currentReserva.idSala = this.reservaForm.get('idSala').value;

    if(this.currentReserva.idSala == 0) {
      this.getToast('','Debe elegir una sala para comprobar disponibilidad',null);
    }

    this.currentReserva.fecha = this.reservaForm.get('fecha').value;

    this.reservaService.checkAvailability(this.currentHoraDesde, this.currentHoraHasta, this.currentReserva).subscribe(e => {
      console.warn(e);
      if((!e) && (this.flag)){
        this.flag = false;
        this.getToast('','La sala no esta disponible para esas horas',null);
      }
    },
    error => {
      console.error(`error al encontrar peticion ${error}`);
    });
  }

  searchDateReservaDesdeChange() {
    this.currentHoraDesde = document.getElementById('search-date-desde-input').getAttribute('value');
    this.sharedService.updateStartHour(this.currentHoraDesde);

    this.onClickHoraHastaAttachObserbableToAdd30();

    if((this.currentHoraDesde != "") && (this.currentHoraHasta != "")) {

      this.currentReservationData();
      
    }

  }

  searchDateReservaHastaChange() {
    this.currentHoraHasta = document.getElementById('search-date-hasta-input').getAttribute('value');
    this.sharedService.updateEndHour(this.currentHoraHasta);

    if((this.currentHoraDesde != "") && (this.currentHoraHasta != "")) {

      this.currentReservationData();
      this.flag = true;
    }

  }

  // loadSalas() {
  //   this.oficinaService.getSalasByOficina(this.currentOficina.idOficina)
  //     .subscribe(salas => {
  //       this.sharedService.salasSelect = salas;
  //     });
  // }

  accept() {
    this.acceptEmiter.emit();
  }

  cancel() {
    this.cancelEmiter.emit();
  }

  private addThirtyMinutes(date: string): string {
    let copy = this.parseStringToDate(date);
    let minutes = copy.getMinutes();
    copy.setMinutes(minutes + 30);

    return copy.toTimeString().substr(0, 5);
  }

  private parseStringToDate(str: string): Date {
    let [hour, minutes] = str.split(":");
    let date = new Date();

    date.setHours(Number.parseInt(hour));
    date.setMinutes(Number.parseInt(minutes));

    return date;
  }

  private isPresentNodeDomNew(): boolean {
    let elementNew = document.getElementsByClassName("new")[0];

    return elementNew == null ? true : false;
  }

  private onClickHoraHastaAttachObserbableToAdd30() {
    let suscripcion: Subscription;
    this.currentHoraDesde$ = this.sharedService.getCurrentHoraDesde$();
    suscripcion = this.currentHoraDesde$
      .subscribe(chd => this.currentHoraHasta = this.addThirtyMinutes(chd));
    suscripcion.unsubscribe();
  }

  showIdSalaView() {
    if (this.reservaForm.get('idSala').invalid || this.reservaForm.get('idSala').value == 0)
      return true;
    else
      return false;
  }
}
