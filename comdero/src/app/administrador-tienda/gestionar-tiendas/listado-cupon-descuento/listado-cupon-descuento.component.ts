import {Component, OnInit} from '@angular/core';
import {DescuentoServicio} from "../../../servicios/descuento.servicio";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-listado-cupon-descuento',
  templateUrl: './listado-cupon-descuento.component.html',
  styleUrls: ['./listado-cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class ListadoCuponDescuentoComponent implements OnInit {

  public identidadTienda;
  public misDescuentos;
  public busqueda;

  public page = 1;
  public pageSize = 10;
  public vectorDescuentos = new Set();
  public result = [];

  public hoy;

  constructor(private datePipe: DatePipe, private _descuentoServicio: DescuentoServicio) {
  }

  async ngOnInit() {

    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misDescuentos = response.data;
    this.hoy = new Date();
    for(let i in this.misDescuentos){
      if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") < this.misDescuentos[i].FECHA_INICIO) {
        this.misDescuentos[i].ESTADO_FECHA="Programado"
      }
      if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") > this.misDescuentos[i].FECHA_FIN) {
        this.misDescuentos[i].ESTADO_FECHA="Vencido"
      }

      if (this.datePipe.transform(this.hoy, "yyyy-MM-dd") >= this.misDescuentos[i].FECHA_INICIO && this.datePipe.transform(this.hoy, "yyyy-MM-dd") <= this.misDescuentos[i].FECHA_FIN ) {
        this.misDescuentos[i].ESTADO_FECHA="Activo"
      }
    }

    debugger;
    this.result = this.misDescuentos;
    console.log("mis productos", this.vectorDescuentos);





  }

  public async filtrar() {
    this.result = await this.search(this.busqueda);
  }

  public search(text: string): any[] {
    return this.misDescuentos.filter(descuento => {
      const term = text.toLowerCase();
      debugger
      return descuento.MOTIVO_DESCUENTO.toLowerCase().includes(term) || descuento.TIPO_DESCUENTO.toLowerCase().includes(term)  // || siguiente
    });
  }

}
