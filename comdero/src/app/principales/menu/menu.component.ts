import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  public tipoBuscador = "Todos";
  public palabraBuscadora: any;

  public objetoDatos = [];
  public datosObtenidos:any;

  constructor(private _tiendaServicio: TiendaServicio) {
  }

  ngOnInit() {

  }

  public cambiarBuscador(busqueda) {
    this.tipoBuscador = busqueda;
  }

  public async buscarDatos() {
    this.objetoDatos = [];
    this.datosObtenidos = '';

    if (this.tipoBuscador == 'Tiendas' && this.palabraBuscadora != '') {
      let response = await this._tiendaServicio.obtenerFiltroPrincipalTienda(this.palabraBuscadora).toPromise();
      this.datosObtenidos = response.data;
      console.log('hola' + JSON.stringify(this.datosObtenidos));
      this.datosObtenidos.forEach(elemnt => {
        this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL)
      })
      console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARTIENDA' + JSON.stringify(this.objetoDatos));
    }

    if (this.tipoBuscador == 'Productos' && this.palabraBuscadora != '') {
      let response = await this._tiendaServicio.obtenerFiltroPrincipalProductos(this.palabraBuscadora).toPromise();
      this.datosObtenidos = response.data;
      console.log('hola' + JSON.stringify(this.datosObtenidos));
      this.datosObtenidos.forEach(elemnt => {
        this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO)
      })
      console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARPRODUCTOS' + JSON.stringify(this.objetoDatos));
    }

    if (this.tipoBuscador == 'Todos' && this.palabraBuscadora != '') {
      let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(this.palabraBuscadora).toPromise();
      this.datosObtenidos = response.data;
      console.log('hola' + JSON.stringify(this.datosObtenidos));

      this.datosObtenidos[0].forEach(elemnt => {
        this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
      })

      this.datosObtenidos[1].forEach(elemnt => {
         this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO);
      })

      console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARTODOS' + JSON.stringify(this.objetoDatos));
    }
  }

  buscarDatosTerm = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? [] :
        this.objetoDatos.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 30))
    )

}

/*  buscarDatosTienda = (text$: Observable<string>) => {
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? [] :
        this.objetoTienda.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10))
    )

  }
}*/
