import { Usuario } from './usuario.model';
export class Reserva {

    public idReserva: number;
    public idSala: number;
    public usuario: Usuario;
    public fecha: string;
    public periodic: boolean;
    public periodicTime: number;
    public horaDesde: string;
    public horaHasta: string;
    public duracion: number;
    public minutoDesde: number;
    public asunto: string;
    public weekDays: number[];

    constructor() {
        this.usuario = new Usuario();
    }

}
