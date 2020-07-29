export class Producto {
  constructor(
    public Cod_Producto: String,
    public Nombre_Producto: String,
    public Descripcion_Producto: String,
    public Detalle_Producto: String,
    public Marca: String,
    public Rastrear_Stock: Number,
    public Vender_Sin_Stock: Number,
    public Condicion: String,
    public Peso_Producto:Number
  ) {
  }
}
