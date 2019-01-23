import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  public weekDays: any[];

  private aux = {
    horaDesde:null,
    horaHasta:null
  }

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
    this.weekDays = [
      {
        name:'lunes',
        value: 2
      },
      {
        name:'martes',
        value: 3
      },
      {
        name:'miercoles',
        value: 4
      },
      {
        name:'jueves',
        value: 5
      },
      {
        name:'viernes',
        value: 6
      },
    ];
  }

  ngOnInit() {
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

    if (this.valorSelect === undefined) {
      this.valorSelect = this.currentReserva.idSala;
    }
  }

  valorSelected(valor: number) {
    this.valorSelect = valor;
    this.reservaForm.get('idSala').setValue(valor);
  }
  buildForm() {
    // initialize form controls
    const controls = this.initControls();
    this.reservaForm = this.formBuilder.group(controls);
    // loads form values
    this.loadForm(this.currentReserva);
  }

  addDaysControls(){
    return this.formBuilder.array(this.weekDays.map(e => this.formBuilder.control(false)));
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
      periodicTime: [
        this.currentReserva.periodicTime
      ],
      weekDays:this.addDaysControls(),
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

    if (reserva.idReserva) {
      this.reservaForm.setValue({
        idReserva: reserva.idReserva,
        idSala: reserva.idSala,
        idUsuario: reserva.usuario.idUsuario,
        nombreUsuario: reserva.usuario.nombre,
        email: reserva.usuario.email,
        extension: reserva.usuario.extension != null ? reserva.usuario.extension : '',
        fecha: reserva.fecha,
        periodic: reserva.periodic || false,
        periodicTime: reserva.periodicTime || null,
        horaDesde: reserva.horaDesde,
        horaHasta: reserva.horaHasta,
        asunto: reserva.asunto != null ? reserva.asunto : 'Reserva de sala',
        weekDays:[null,null,null,null,null]
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
    if (this.reservaForm.get('periodic').value) {
      retVal.periodic = true;
      retVal.periodicTime = this.reservaForm.get('periodicTime').value;
      let days = [];
      this.daysArray.controls.forEach((control,i) =>{
        if(control.value){
          days.push(this.weekDays[i].value);
        }
      });
      retVal.weekDays = days.length > 0 ? days : null;
    }else {
      retVal.periodic = false;
      retVal.periodicTime = 0;
    }
    retVal.horaDesde = this.reservaForm.get('horaDesde').value;
    retVal.horaHasta = this.reservaForm.get('horaHasta').value;
    retVal.asunto = this.reservaForm.get('asunto').value;
    return retVal;
  }

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
      //Levantar los labels de los demas campos
      document.querySelector('#lblemail').classList.add('active')
      document.querySelector('#lblextension').classList.add('active')
      document.querySelector('#lblempleado').classList.add('active')
    }
    this.usuariosList = new Array<Usuario>();
  }

  save() {
    // updates reserva object with form data
    this.currentReserva = this.getFormData(this.reservaForm.value);
    this.sharedService.updateCurrentReserva(this.currentReserva);
    if (this.currentReserva.idSala === 0 || isNaN(this.currentReserva.idSala) || this.currentReserva.idSala === null) {
      // opens confirmation dialog
      const confirmation = new ConfirmationPopup();
      confirmation.title = 'Faltan datos';
      confirmation.message = 'No ha seleccionado la sala';
      confirmation.action = '';
      confirmation.active = false;
      this.confirmationPopupChange.emit(confirmation);
    } else if (this.currentReserva.periodic && (this.currentReserva.periodicTime > 10
                || this.currentReserva.periodicTime <= 0 || this.currentReserva.periodicTime === null)) {
      // opens confirmation dialog
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

  ckeckReservaDesdeHasta() {
    return  (this.currentHoraDesde != "") && (this.currentHoraHasta != "");
  }

  currentReservationData() {
    this.currentReserva.idSala = this.reservaForm.get('idSala').value;

    if(this.currentReserva.idSala == 0) {
      this.getToast('','Debe elegir una sala para comprobar disponibilidad','red');
    }

    this.currentReserva.fecha = this.reservaForm.get('fecha').value;

    this.reservaService.checkAvailability(this.currentHoraDesde, this.currentHoraHasta, this.currentReserva).subscribe(e => {
      console.warn(e);
      if(!e && this.flag){
        this.flag = false;
        this.currentReserva.horaDesde = this.aux.horaDesde;
        this.currentReserva.horaHasta = this.aux.horaHasta;
        this.currentReserva.fecha = this.reservaForm.get('fecha').value;
        this.buildForm();
        this.getToast('Error en la reserva','La sala no esta disponible para esas horas','red');
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
      this.flag = true;

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

  accept() {
    this.acceptEmiter.emit();
  }

  cancel() {
    this.cancelEmiter.emit();
  }

  private addThirtyMinutes(date: string): string {
    const copy = this.parseStringToDate(date);
    const minutes = copy.getMinutes();
    copy.setMinutes(minutes + 30);

    return copy.toTimeString().substr(0, 5);
  }

  private parseStringToDate(str: string): Date {
    const[hour, minutes] = str.split(':');
    const date = new Date();

    date.setHours(Number.parseInt(hour));
    date.setMinutes(Number.parseInt(minutes));

    return date;
  }

  private isPresentNodeDomNew(): boolean {
    return document.getElementsByClassName('new')[0] == null;
  }

  private onClickHoraHastaAttachObserbableToAdd30() {
    let suscripcion: Subscription;
    this.currentHoraDesde$ = this.sharedService.getCurrentHoraDesde$();
    suscripcion = this.currentHoraDesde$
      .subscribe(chd => this.currentHoraHasta = this.addThirtyMinutes(chd));
    suscripcion.unsubscribe();
  }

  showIdSalaView() {
       return this.reservaForm.get('idSala').invalid || this.reservaForm.get('idSala').value === 0;
  }

  getOriginalHourValue(){
    this.aux.horaDesde = this.reservaForm.get('horaDesde').value;
    this.aux.horaHasta = this.reservaForm.get('horaHasta').value;
  }

  checkAllDays($event){
    console.log(this.reservaForm.get('weekDays').value);
    if($event.target.checked){
      this.daysArray.controls.forEach((e,i) => e.setValue(this.weekDays[i].value))
    }else{
      this.daysArray.controls.forEach(e => e.setValue(null))
    }
  }

  get daysArray(){
    return <FormArray>this.reservaForm.get('weekDays');
  }
}
