export class Oferta {
  constructor(
    public Id_Oferta: Number,
    public Num_Tienda: String,
    public Id_Producto: Number,
    public Cod_Producto: String,
    public Iva: Number,
    public Fecha_Creacion: String,
    public Ofrece_Envio_Local: Number,
    public Ofrece_Envio_Externo: Number,
    public Ofrece_ERetiro_Personal: Number,
    public Reserva: Number,
    public Garantia: String,
  ) {
  }
}
