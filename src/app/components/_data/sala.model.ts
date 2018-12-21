import { Reserva } from "./reserva.model";

export class Sala {

    public idSala: number;
    public idOficina: number;
    public nombre: string;
    public plazas: string;
    public detalle: string;
    public reservas: Reserva[];

    constructor() {
        this.reservas = new Array<Reserva>();
    }

}
