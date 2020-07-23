import {Time} from "@angular/common";

export class Descuento {
  constructor(
    public Motivo_Descuento: String,
    public Porcentaje_Descuento: String,
    public Fecha_Inicio:String,
    public Fecha_FIn:String,
    public Tipo_Descuento:String,
    public Hora_Inicio:Time,
    public Hora_Fin:Time,
    public Estado_Descuento:Number

  ) {
  }
}
