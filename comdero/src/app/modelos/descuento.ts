import {Time} from "@angular/common";

export class Descuento {
  constructor(
    public Motivo_Descuento: String,
    public Porcentaje_Descuento: String,
    public Fecha_Inicio:Date,
    public Fecha_FIn:Date,
    public Tipo_Descuento:String,
    public Hora_Inicio:Time,
    public hora_FIn:Time,
    public Estado_Descuento:Number

  ) {
  }
}
