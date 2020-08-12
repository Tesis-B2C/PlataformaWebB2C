import {Component, OnDestroy, OnInit} from '@angular/core';
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, OnDestroy {
  public tipoBuscador = "Todos";
  public palabraBuscadora = "";

  public objetoDatos = [];
  public datosObtenidos: any;

  constructor(private route: ActivatedRoute, private _tiendaServicio: TiendaServicio, private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    delete this.objetoDatos;
    delete this.tipoBuscador;
    delete this.palabraBuscadora;
    delete this.datosObtenidos;
  }

  public cambiarBuscador(busqueda) {
    this.tipoBuscador = busqueda;
  }

  public async buscarDatos(palabraBuscar) {
    this.objetoDatos = [];
    this.datosObtenidos = '';
    palabraBuscar = palabraBuscar.trim();
    if(palabraBuscar != 0){
      if (this.tipoBuscador == 'Tiendas' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTienda(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL)
        })
      }

      if (this.tipoBuscador == 'Productos' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalProductos(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO)
        })
      }

      if (this.tipoBuscador == 'Todos' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;

        this.datosObtenidos[0].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
        })

        this.datosObtenidos[1].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO);
        })
      }
    }
  }

  buscarDatosTerm = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? [] :
        this.objetoDatos.filter(v => v.toLowerCase().indexOf(term.toLowerCase().trim()) > -1).slice(0, 30))
    )

  public buscarPalabra(palabraBuscada: string) {
    palabraBuscada = palabraBuscada.trim();
    if (palabraBuscada == "" || palabraBuscada == null) {
      location.href = '**';
    } else {
      location.href = 'principales/menu/busqueda/'+palabraBuscada;
    }
  }
}
