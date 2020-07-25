import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DescuentoServicio} from "../../../servicios/descuento.servicio";
import Swal from "sweetalert2";
import {Descuento} from "../../../modelos/descuento";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-modificar-cupon-descuento',
  templateUrl: './modificar-cupon-descuento.component.html',
  styleUrls: ['./modificar-cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class ModificarCuponDescuentoComponent implements OnInit {
  public idDescuento;
  public identidadDescuento;
  public Descuento;
  public banderaCuponDescuento: boolean = true;
  public banderaValidaciones: boolean = true;
  public banderaOpcionAplicarA: boolean;
  public result = [];
  public vectorProductos = new Set();
  public vectorProductosEnviar = [];
  public page = 1;
  public pageSize = 10;

  public page2 = 1;
  public pageSize2 = 10;

  public identidadTienda
  public misProductos = [];
  public busqueda;
  // public bsRangeValue;


  public bsValue;
  public bsRangeValue: Date[];
  public maxDate;
  public banderaModificar: boolean = false;

  constructor(private datePipe: DatePipe, private _productoServicio: ProductoServicio, private modalService: NgbModal, private _descuentoServicio: DescuentoServicio, private route: ActivatedRoute) {
    this.Descuento = new Descuento(null, null, null, null, null, null, null, null, null);

  }

  async ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
    let misProductos = response.data;
    for (let i in response.data) {
      this.misProductos.push(misProductos[i].PRODUCTO);
      this.result.push(misProductos[i].PRODUCTO);
    }
    await this.iniciarModificarDescuento();

  }

  public iniciarEdicion() {
    this.banderaModificar = true;

  }

  public async getDescuento() {
    try {
      this.idDescuento = this.route.snapshot.params.id;
      let response = await this._descuentoServicio.getDescuento(this.idDescuento).toPromise();
      this.identidadDescuento = response.data


    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }


  public async iniciarModificarDescuento() {
    this.cancelar();
    await this.getDescuento();
    this.Descuento.Motivo_Descuento = this.identidadDescuento.MOTIVO_DESCUENTO;
    this.Descuento.Porcentaje_Descuento = this.identidadDescuento.PORCENTAJE_DESCUENTO;
    this.Descuento.Fecha_Inicio = this.identidadDescuento.FECHA_INICIO;
    this.Descuento.Fecha_FIn = this.identidadDescuento.FECHA_FIN;
    this.Descuento.Hora_Inicio = this.identidadDescuento.HORA_INICIO;
    this.Descuento.Hora_Fin = this.identidadDescuento.HORA_FIN;
    this.Descuento.Tipo_Descuento = this.identidadDescuento.TIPO_DESCUENTO;
    this.Descuento.Estado_Descuento = this.identidadDescuento.ESTADO_DESCUENTO;
    this.Descuento.AplicarA = this.identidadDescuento.APLICARA;

    if (this.Descuento.Tipo_Descuento == 'Cupón') {
      this.banderaCuponDescuento = true;
    } else if (this.Descuento.Tipo_Descuento == 'Automático') {
      this.banderaCuponDescuento = false
    }

    if (this.Descuento.AplicarA == 'todos') {
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
        this.vectorProductosEnviar.push(this.result[i]);
      }
    } else {
      for (let i in this.result) {
        for (let j in this.identidadDescuento.PRODUCTO_DESCUENTOs) {
          if (this.identidadDescuento.PRODUCTO_DESCUENTOs[j].ID_PRODUCTO == this.result[i].ID_PRODUCTO) {
            this.vectorProductos.add(this.result[i]);
            this.vectorProductosEnviar.push(this.result[i]);
          }
        }
      }

    }
    this.bsValue = new Date(this.datePipe.transform(this.Descuento.Fecha_Inicio));
    this.maxDate = new Date(this.datePipe.transform(this.Descuento.Fecha_FIn));
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

  }

  public cancelar() {
    this.banderaCuponDescuento = true;
    this.banderaValidaciones = true;
    this.vectorProductos = new Set();
    this.vectorProductosEnviar = [];
    this.page = 1;
    this.pageSize = 10;

    this.page2 = 1;
    this.pageSize2 = 10;
    this.banderaModificar = false
  }

  public generarCodigDescuento() {
    this.Descuento.Motivo_Descuento = this.makeid(8);

  }

  public makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public opcionAplicarA(value) {
    debugger;
    this.banderaOpcionAplicarA = value;
    if (this.banderaOpcionAplicarA) {

      this.Descuento.AplicarA = 'todos';
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
      }
      for (let producto of this.vectorProductos) {
        this.vectorProductosEnviar.push(producto);
      }

    } else {
      this.Descuento.AplicarA = 'espesificos';
      this.vectorProductos = new Set();
      this.vectorProductosEnviar = [];
    }
  }


  public abrirModalProductos(content) {
    this.modalService.open(content, {centered: true, size: 'lg', scrollable: true});
    for (let producto of this.vectorProductosEnviar) {
      this.vectorProductos.add(producto);
    }

    console.log("set vector productos", this.vectorProductos)
  }

  async busquedasasd() {
    this.result = await this.search(this.busqueda);
  }

  public search(text: string): any[] {
    return this.misProductos.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente
    });
  }

  public agregarTodosProductos(event) {
    if (event.target.checked) {
      debugger
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
      }
      console.log("vector productos", this.vectorProductos)


    } else {
      this.vectorProductos = new Set();
    }

  }

  public borrar(producto) {
    this.vectorProductos.delete(producto)
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {
      this.vectorProductosEnviar.push(producto);
    }
  }

  public agregar() {
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {

      this.vectorProductosEnviar.push(producto);
    }
  }


  public agregarProducto(event, cod) {
    if (event.target.checked) {
      debugger
      this.vectorProductos.add(cod);
      console.log("vector productos", this.vectorProductos)
    } else {
      this.vectorProductos.delete(cod);
    }
  }


  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal'
        //icon:'sm'
      }
    });
  }


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}
