export class Metodo_Pago {
  constructor(
    public Porcentaje_Descuento: Number,
    public Numero_Cuenta: Number,
    public Tipo_Cuenta: String,
    public Banco_Pertenece: String,
    public Api_Key_Paypal: String,
    public Porcentaje_Recargo: Number,
    public Tipo_Pago: String,
    public Nombre_Beneficiario:String,
    public Correo_Beneficiario:String,
    public Identificacion_Beneficiario:String,
  ) {
  }
}
