import {Component, OnDestroy, OnInit} from '@angular/core';
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import {AgenteServicio} from "../../servicios/agente.servicio";

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

  constructor(private _agenteServicio: AgenteServicio, private route: ActivatedRoute, private _tiendaServicio: TiendaServicio, private router: Router) {
  }

  ngOnInit() {
    console.log("user", JSON.stringify(this._agenteServicio.getIdentity()))
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
    if (palabraBuscar != 0) {
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
          this.objetoDatos.push(elemnt.PRODUCTO.NOMBRE_PRODUCTO);
        })
      }

      if (this.tipoBuscador == 'Todos' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        console.log('DATOS' + JSON.stringify(this.datosObtenidos))
        this.datosObtenidos[0].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
        })

        this.datosObtenidos[1].forEach(elemnt => {
          this.objetoDatos.push(elemnt.PRODUCTO.NOMBRE_PRODUCTO);
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
    if (palabraBuscada.trim() == "" || palabraBuscada.trim() == null) {
      console.log(palabraBuscada.trim() + "ya mismo me voy");
      this.router.navigate(['**']);
    } else {
      palabraBuscada = palabraBuscada.trim();

      this.router.navigate(['principales/menu/busqueda/' + palabraBuscada]);

    }
  }
}
