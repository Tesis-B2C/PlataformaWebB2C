import {Component, OnInit} from '@angular/core';

import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import {Color} from "ng2-charts";
import {EstadisticasServicio} from "../../../servicios/estadisticas.servicio";
import Swal from "sweetalert2";

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
  public pieChartLabels = ['hola 20', 'hoola 234', 'hola 556'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {

      /* backgroundColor: ['rgba(255,0,0,05)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)'], */
      backgroundColor: ['#ff788b', '#66a7f4', '#7cce83'],
    },
  ];


  //barchart

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
  public barChartColors: Color[] = [
    {backgroundColor: 'red'},
    {backgroundColor: 'green'},
  ]


  ////// curveChart
  public curveChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {xAxes: [{}], yAxes: [{}]},
  };
  public curveChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public curveChartType: ChartType = 'line';
  public curveChartLegend = true;
  public curveChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
  public curveChartColors = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }

  ];




  public identidadTienda;
  public ventas;
  public calificacion;
  public productos;
  constructor(public _estadisticasServicio: EstadisticasServicio) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }

  ngOnInit(): void {
    this.getVentas();
    this.getCalificaciones();
    this.getProductos();
  }

  public async getVentas() {
    try {
      let response = await this._estadisticasServicio.getVentas(this.identidadTienda.NUM_TIENDA).toPromise();
      console.log("count", response.data);
      this.ventas = response.data[0]['COMPRAS_COUNT'];
    } catch (e) {
      console.log("error", e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }


  public async getCalificaciones() {
    try {
      let response = await this._estadisticasServicio.getCalificaciones(this.identidadTienda.NUM_TIENDA).toPromise();
      console.log("avg", response.data);
     let calificacion =response.data[0]['PRODUCTO'].CALIFICACIONs[0].CALIFICACION_AVG;
      this.calificacion = parseFloat(calificacion).toFixed(2);
    } catch (e) {
      console.log("error", e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }


  public async getProductos() {
    try {
      let response = await this._estadisticasServicio.getProductos(this.identidadTienda.NUM_TIENDA).toPromise();
      console.log("productoscount", response.data);
      this.productos=response.data[0].OFERTAS_COUNT

    } catch (e) {
      console.log("error", e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
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
