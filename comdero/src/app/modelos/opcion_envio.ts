export class Opcion_Envio {
  constructor(
    public Tipo_Envio: String,
    public Tipo_Ubicacion: String,
    public Tipo_Medida: String,
    public Hora_Estimada_Retiro: String,
    public Instruccion_Retiro: String,
    public Minimo: Number,
    public Maximo: Number,
    public Precio: Number
  ) {
  }
}
