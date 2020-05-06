export class Producto {
  constructor(
    public Id_Producto: Number,
    public Cod_Producto: String,
    public ID_Oferta: Number,
    public Nombre_Producto: String,
    public Descripcion_Producto: String,
    public Detalle_Producto: String,
    public Marca: String,
    public Llevar_Stock: Number,
    public Vendere_Sin_Stock: Number,
    public Condicion: String,
  ) {
  }
}
