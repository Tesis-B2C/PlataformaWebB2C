import {Component, OnInit} from '@angular/core';

import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import {Color} from "ng2-charts";
import {EstadisticasServicio} from "../../../servicios/estadisticas.servicio";
import Swal from "sweetalert2";
import * as moment from 'moment';
import {GLOBAL} from "../../../servicios/global";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',

    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels = ['Efectivo', 'Transferencia', 'Paypal'];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {

      /* backgroundColor: ['rgba(255,0,0,05)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)'], */
      backgroundColor: ['#ff788b', '#66a7f4', '#7cce83'],
    },
  ];
  public pieChartLabels1 = ['Retiro', 'Acordado', 'A domicilio'];
  public pieChartData1: number[] = [0, 0, 0];


  //barchart

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true

  };
  public barChartLabels = ['Estadística'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [20, 0], label: 'Ventas'},
    {data: [30, 0], label: 'Visitas'}
  ];
  public barChartColors: Color[] = [
    {backgroundColor: '#ff788b'},
    {backgroundColor: '#66a7f4'},
  ]


  ////// curveChart
  public curveChartOptions = {
    responsive: true,
    legend: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [{
        ticks: {
          stepSize: 1,

        }
      }]
    }
  };
  public curveChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Dieciembre'];
  public curveChartType: ChartType = 'line';
  public curveChartLegend = true;
  public curveChartData = [
    {data: [0, 0, 0, 0, 0, 0], label: 'Ventas'}
  ];
  public curveChartColors = [

    { // red
      backgroundColor: 'rgba(102,167,244,0.5)',
      borderColor: '#0971eb',
      pointBackgroundColor: '#034ca2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(102,167,244,0.5)',
    }

  ];

//dona
  doughnutChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },

  };
  public doughnutChartLabels = ['Cupones', 'Descuentos'];
  public doughnutChartData = [
    [25, 100 - 25],

  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnuChartColors = [
    {
      /* backgroundColor: ['rgba(255,0,0,05)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)'], */
      backgroundColor: ['#ff788b', '#66a7f4', '#7cce83'],
    },
  ];


  public identidadTienda;
  public ventas;
  public calificacion;
  public productos;
  public visitas;

  constructor(public _estadisticasServicio: EstadisticasServicio) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }

  ngOnInit(): void {
    this.getVentas();
    this.getCalificaciones();
    this.getProductos();
    this.getVisitas();
    this.getMetodosPago();
    this.getMetodosEnvio();
    this.getDescuentos();
    this.obtenerAnios();
    this.getVentasMensuales();
    this.ventasVsVisitas();
    this.getProductoMasVendido();
  }

  public async getVentas() {
    try {
      let response = await this._estadisticasServicio.getVentas(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("count", response.data);
      this.ventas = response.data;
    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }


  public async getCalificaciones() {
   this.calificacion=0;
    try {
      let response = await this._estadisticasServicio.getCalificaciones(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("avg", response.data);
      let calificacion ;
      if(response.data[0]['PRODUCTO']){
        calificacion= response.data[0]['PRODUCTO'].CALIFICACIONs[0].CALIFICACION_AVG;
        this.calificacion = parseFloat(calificacion).toFixed(2);
      }


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }


  public async getProductos() {
    try {
      let response = await this._estadisticasServicio.getProductos(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("productoscount", response.data);
      this.productos = response.data

    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }


  public async getVisitas() {
    try {
      let response = await this._estadisticasServicio.getVisitas(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("visitas", response.data);
      this.visitas = response.data['VISITAS'];

    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public metodosPago;
  public async getMetodosPago() {
    try {
      let response = await this._estadisticasServicio.getMetodosPago(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("metodos pago", response.data);
      this.metodosPago=response.data;
      this.pieChartData = [response.data['Efectivo'], response.data['Transferencia'], response.data['PayPal']]


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }

    }
  }


  public metodosEnvio;
  public async getMetodosEnvio() {
    try {
      let response = await this._estadisticasServicio.getMetodosEnvio(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("metodos pago", response.data);
      this.metodosEnvio=response.data;
      this.pieChartData1 = [response.data['Retiro'], response.data['Acordar'], response.data['Domicilio']]


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public descuentos;
  public async getDescuentos() {
    try {
      let response = await this._estadisticasServicio.getDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("descuentos", response.data);
      this.descuentos=response.data;
      this.doughnutChartData = [response.data['Cupon'], response.data['Automatico']]


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }

    }
  }

  public contEnero = 0;
  public contFebrero = 0;
  public contMarzo = 0;
  public contAbril = 0;
  public contMayo = 0;
  public contJunio = 0;
  public contJulio = 0;
  public contAgosto = 0;
  public contSeptiembre = 0;
  public contOctubre = 0;
  public contNoviembre = 0;
  public contDiciembre = 0;
  public anios = new Set();
  public anioActual = moment().year();

  public async obtenerAnios() {
    this.anios = new Set();
    let response = await this._estadisticasServicio.getVentasMensuales(this.identidadTienda.NUM_TIENDA).toPromise();
    let fechas = response.data;
    for (let i in response.data) {
      let fecha = fechas[i].FECHA_COMPRA.split('-');
      this.anios.add(fecha[0]);
    }
  }

  public async getVentasMensuales() {
    this.contEnero = 0;
    this.contFebrero = 0;
    this.contMarzo = 0;
    this.contAbril = 0;
    this.contMayo = 0;
    this.contJunio = 0;
    this.contJulio = 0;
    this.contAgosto = 0;
    this.contSeptiembre = 0;
    this.contOctubre = 0;
    this.contNoviembre = 0;
    this.contDiciembre = 0;
    try {
      let response = await this._estadisticasServicio.getVentasMensuales(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("ventas mensuales", response.data);
      let fechas = response.data
      for (let i in response.data) {
        let fecha = fechas[i].FECHA_COMPRA.split('-');
        if (fecha[0] == this.anioActual) {
          if (fecha[1] == '01') {
            this.contEnero = this.contEnero + 1;
          }
          if (fecha[1] == '02') {
            this.contFebrero = this.contFebrero + 1;
          }
          if (fecha[1] == '03') {
            this.contMarzo = this.contMarzo + 1;
          }
          if (fecha[1] == '04') {
            this.contAbril = this.contAbril + 1;
          }
          if (fecha[1] == '05') {
            this.contMayo = this.contMayo + 1;
          }
          if (fecha[1] == '06') {
            this.contJunio = this.contJunio + 1;
          }
          if (fecha[1] == '07') {
            this.contJulio = this.contJulio + 1;
          }
          if (fecha[1] == '08') {
            this.contAgosto = this.contAgosto + 1;
          }
          if (fecha[1] == '09') {
            this.contSeptiembre = this.contSeptiembre + 1;
          }
          if (fecha[1] == '10') {
            this.contOctubre = this.contOctubre + 1;
          }
          if (fecha[1] == '11') {
            this.contNoviembre = this.contNoviembre + 1;
          }
          if (fecha[1] == '12') {
            this.contDiciembre = this.contDiciembre + 1;
          }

        }
      }

      this.curveChartData = [
        {
          data: [this.contEnero, this.contFebrero, this.contMarzo, this.contAbril, this.contMayo, this.contJunio, this.contJulio,
            this.contAgosto, this.contSeptiembre, this.contOctubre, this.contNoviembre, this.contDiciembre],
          label: 'Ventas'
        },
      ];

    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  cambiarAnio(value) {
    this.anioActual = value;
    // console.log("value", value);
    this.getVentasMensuales();
  }

  public async ventasVsVisitas() {
    try {
      let response = await this._estadisticasServicio.getVentasVisitas(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("Ventas", response.data);
      this.barChartData = [
        {data: [response.data['Ventas'], 0], label: 'Ventas'},
        {data: [response.data['Visitas'], 0], label: 'Visitas'},
      ];


    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }

    }
  }

  public productoMasVendido;

  public async getProductoMasVendido() {
    try {
      let response = await this._estadisticasServicio.getProductoMasVendido(this.identidadTienda.NUM_TIENDA).toPromise();
      // console.log("mas vendido variantes inicial", response.data);
      let vVariantes = []
      for (let i in response.data) {
        vVariantes.push(response.data[i].COMPRA_PRODUCTOs[0].NUM_VARIANTE)
      }
      let response2 = await this._estadisticasServicio.getProductoDetalleMasVendido(this.mode(vVariantes)).toPromise();
      this.productoMasVendido = response2.data;
      // console.log("mas vendido", this.productoMasVendido);

    } catch (e) {
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public maxValue = 0;
  public maxCount = 0;

  public mode(a) {
    for (let i in a) {
      let count = 0;
      for (let j in a) {
        if (a[j] == a[i]) ++count;
      }
      if (count > this.maxCount) {
        this.maxCount = count;
        this.maxValue = a[i];
      }
    }
    // console.log("modaaaa", this.maxValue);
    return this.maxValue;
  }

  public noExite;

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-imagen1.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
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
        //icon:'sm'
      }
    });
  }

  // events
  public chartClicked({event, active}: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({event, active}: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

}
