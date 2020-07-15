import {Component, OnDestroy, OnInit} from '@angular/core';
import {Opcion_Envio} from "../../../modelos/opcion_envio";
import {CurrencyPipe} from "@angular/common";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css'],
  providers: [CurrencyPipe]
})

export class MetodosEnvioComponent implements OnInit, OnDestroy {
  public banderaRetiroLocal: boolean = true;
  public banderaEnvioDomicilio: boolean = true;
  public banderaEdicionDeshabilitada: boolean = true;

  public objetoRetiroLocal;

  public objetoAuxiliarLocal;
  public vectorTarifasLocal = [];
  public banderaTarifaLocalPeso: boolean = true;
  public banderaTarifaLocalPrecio: boolean = false;

  public objetoAuxiliarResto;
  public vectorTarifasResto = [];
  public banderaTarifaRestoPeso: boolean = true;
  public banderaTarifaRestoPrecio: boolean = false;

  public banderaTipoAccionLocal;
  public banderaTipoAccionResto;

  constructor(public toastr: ToastrService, private cp: CurrencyPipe, private modalService: NgbModal) {
  }

  ngOnInit() {
    let mensaje = 'Debes traer tu mensaje de confirmación e identificación cuando vengas a retirar tu pedido.';
    this.objetoAuxiliarLocal = new Opcion_Envio('Domicilio', 'Local', 'Peso', null, null, 0, 999.99, 0);
    this.objetoAuxiliarResto = new Opcion_Envio('Domicilio', 'Resto', 'Peso', null, null, 0, 999.99, 0);
    this.objetoRetiroLocal = new Opcion_Envio('Retiro', null, null, null, mensaje, null, null, null);
  }

  ngOnDestroy() {
    delete this.objetoAuxiliarLocal;
    delete this.vectorTarifasLocal;
    delete this.objetoAuxiliarResto;
    delete this.vectorTarifasResto;
    delete this.objetoRetiroLocal;
  }

  public clickEnvioDomicilio(event) {
    if (event.target.checked) {
      this.banderaEnvioDomicilio = false;
    } else {
      this.banderaEnvioDomicilio = true;
    }
  }

  public clickRetiroLocal(event) {
    if (event.target.checked) {
      this.banderaRetiroLocal = false;
    } else {
      this.banderaRetiroLocal = true;
    }
  }

//INICIO RETIRO LOCAL

//FIN RETIRO LOCAL


  //Envio a domicilio LOCAL
  public abrirModalLocal(modalLocal) {
    this.banderaTarifaLocalPeso = true;
    this.banderaTarifaLocalPrecio = false;
    this.banderaTipoAccionLocal = 'Agregar';
    this.modalService.open(modalLocal, {centered: true, size: 'md'});
  }

  public opcTarifaLocal(opcion, event) {
    if (opcion == 'peso' && event.target.checked) {
      this.objetoAuxiliarLocal.Tipo_Medida = 'Peso';
      this.banderaTarifaLocalPeso = true;
      this.banderaTarifaLocalPrecio = false;
    }

    if (opcion == 'precio' && event.target.checked) {
      this.objetoAuxiliarLocal.Tipo_Medida = 'Precio';
      this.banderaTarifaLocalPeso = false;
      this.banderaTarifaLocalPrecio = true;
    }
  }

  public cancelarTarifaLocal() {
    this.banderaTarifaLocalPeso = false;
    this.banderaTarifaLocalPrecio = false;
    this.objetoAuxiliarLocal = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public agregarTarifaLocal() {
    this.vectorTarifasLocal.push(new Opcion_Envio('Domicilio', 'Local', this.objetoAuxiliarLocal.Tipo_Medida, null, null, this.objetoAuxiliarLocal.Minimo, this.objetoAuxiliarLocal.Maximo, this.objetoAuxiliarLocal.Precio));
    this.objetoAuxiliarLocal = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public indiceEditarLocal;

  public editarTarifaLocal() {
    this.vectorTarifasLocal[this.indiceEditarLocal].Tipo_Medida = this.objetoAuxiliarLocal.Tipo_Medida;
    this.vectorTarifasLocal[this.indiceEditarLocal].Minimo = this.objetoAuxiliarLocal.Minimo;
    this.vectorTarifasLocal[this.indiceEditarLocal].Maximo = this.objetoAuxiliarLocal.Maximo;
    this.vectorTarifasLocal[this.indiceEditarLocal].Precio = this.objetoAuxiliarLocal.Precio;
    this.objetoAuxiliarLocal = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public editarAbrirTarifaLocal(indice, modalLocal) {
    this.indiceEditarLocal = indice;
    if (this.vectorTarifasLocal[indice].Tipo_Medida == 'Peso') {
      this.banderaTarifaLocalPeso = true;
      this.banderaTarifaLocalPrecio = false;
    }

    if (this.vectorTarifasLocal[indice].Tipo_Medida == 'Precio') {
      this.banderaTarifaLocalPeso = false;
      this.banderaTarifaLocalPrecio = true;
    }

    this.objetoAuxiliarLocal.Precio = this.vectorTarifasLocal[indice].Precio;
    this.objetoAuxiliarLocal.Minimo = this.vectorTarifasLocal[indice].Minimo;
    this.objetoAuxiliarLocal.Maximo = this.vectorTarifasLocal[indice].Maximo;
    this.banderaTipoAccionLocal = 'Editar';
    this.modalService.open(modalLocal, {centered: true, size: 'md'});
  }

  public eliminarTarifaLocal(indice) {
    this.vectorTarifasLocal.splice(indice, 1);
  }

  //FIN Envio a domicilio LOCAL

  //Envio a domicilio RESTO
  public abrirModalResto(modalResto) {
    this.banderaTarifaRestoPeso = true;
    this.banderaTarifaRestoPrecio = false;
    this.banderaTipoAccionResto = 'Agregar';
    this.modalService.open(modalResto, {centered: true, size: 'md'});
  }

  public opcTarifaResto(opcion, event) {
    if (opcion == 'peso' && event.target.checked) {
      this.objetoAuxiliarResto.Tipo_Medida = 'Peso';
      this.banderaTarifaRestoPeso = true;
      this.banderaTarifaRestoPrecio = false;
    }

    if (opcion == 'precio' && event.target.checked) {
      this.objetoAuxiliarResto.Tipo_Medida = 'Precio';
      this.banderaTarifaRestoPeso = false;
      this.banderaTarifaRestoPrecio = true;
    }
  }

  public cancelarTarifaResto() {
    this.banderaTarifaRestoPeso = false;
    this.banderaTarifaRestoPrecio = false;
    this.objetoAuxiliarResto = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public agregarTarifaResto() {
    this.vectorTarifasResto.push(new Opcion_Envio('Domicilio', 'Resto', this.objetoAuxiliarResto.Tipo_Medida, null, null, this.objetoAuxiliarResto.Minimo, this.objetoAuxiliarResto.Maximo, this.objetoAuxiliarResto.Precio));
    this.objetoAuxiliarResto = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public indiceEditarResto;

  public editarTarifaResto() {
    this.vectorTarifasResto[this.indiceEditarResto].Tipo_Medida = this.objetoAuxiliarResto.Tipo_Medida;
    this.vectorTarifasResto[this.indiceEditarResto].Minimo = this.objetoAuxiliarResto.Minimo;
    this.vectorTarifasResto[this.indiceEditarResto].Maximo = this.objetoAuxiliarResto.Maximo;
    this.vectorTarifasResto[this.indiceEditarResto].Precio = this.objetoAuxiliarResto.Precio;
    this.objetoAuxiliarResto = new Opcion_Envio(null, null, 'Peso', null, null, 0, 999.99, 0);
  }

  public editarAbrirTarifaResto(indice, modalResto) {
    this.indiceEditarResto = indice;
    if (this.vectorTarifasResto[indice].Tipo_Medida == 'Peso') {
      this.banderaTarifaRestoPeso = true;
      this.banderaTarifaRestoPrecio = false;
    }

    if (this.vectorTarifasResto[indice].Tipo_Medida == 'Precio') {
      this.banderaTarifaRestoPeso = false;
      this.banderaTarifaRestoPrecio = true;
    }

    this.objetoAuxiliarResto.Precio = this.vectorTarifasResto[indice].Precio;
    this.objetoAuxiliarResto.Minimo = this.vectorTarifasResto[indice].Minimo;
    this.objetoAuxiliarResto.Maximo = this.vectorTarifasResto[indice].Maximo;
    this.banderaTipoAccionResto = 'Editar';
    this.modalService.open(modalResto, {centered: true, size: 'md'});
  }

  public eliminarTarifaResto(indice) {
    this.vectorTarifasResto.splice(indice, 1);
  }

  //FIN Envio a domicilio RESTO

  public transformar(element: any) {
    debugger;
    let valor = this.cp.transform(element.target.value, '$',);
    //let alter=formatCurrency(element.target.value,'USD',getCurrencySymbol('USD', 'wide'));
    let valor2 = valor.split("$")
    element.target.value = valor2[1].replace(',', "");
  }

  public habilitarEdicion(){

  }

  public modificarMetodoEnvio(){

  }

  public cancelarModificacion(){}


}
