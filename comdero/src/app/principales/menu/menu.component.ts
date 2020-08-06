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

    if(palabraBuscar != 0){
      console.log(+palabraBuscar+'XXXXXXXXXXXXXXXXXXX');
      if (this.tipoBuscador == 'Tiendas' && palabraBuscar != '') {
        console.log('================================================== palabraBuscar');
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTienda(palabraBuscar.trim()).toPromise();
        this.datosObtenidos = response.data;
        console.log('hola' + JSON.stringify(this.datosObtenidos));
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL)
        })
        console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARTIENDA' + JSON.stringify(this.objetoDatos));
      }

      if (this.tipoBuscador == 'Productos' && palabraBuscar != '') {
        console.log('==================================================');
        let response = await this._tiendaServicio.obtenerFiltroPrincipalProductos(palabraBuscar.trim()).toPromise();
        this.datosObtenidos = response.data;
        console.log('hola' + JSON.stringify(this.datosObtenidos));
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO)
        })
        console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARPRODUCTOS' + JSON.stringify(this.objetoDatos));
      }

      if (this.tipoBuscador == 'Todos' && palabraBuscar != '') {
        console.log('==================================================');
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(palabraBuscar.trim()).toPromise();
        this.datosObtenidos = response.data;
        console.log('TODOS PALABRA BUSCADORA' + JSON.stringify(this.datosObtenidos));

        this.datosObtenidos[0].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
        })

        this.datosObtenidos[1].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO);
        })
        console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARTODOS' + JSON.stringify(this.objetoDatos));
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
      console.log(palabraBuscada.trim()+ "ya mismo me voy");
      location.href = '**';
    } else {
      palabraBuscada = palabraBuscada.trim();
      location.href = 'principales/menu/busqueda/'+palabraBuscada;
    }
  }
}
