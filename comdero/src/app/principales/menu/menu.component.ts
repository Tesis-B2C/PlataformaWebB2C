import {Component, OnDestroy, OnInit} from '@angular/core';
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Router} from '@angular/router';

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

  constructor(private _tiendaServicio: TiendaServicio, private router: Router) {
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

  public async buscarDatos() {
    this.objetoDatos = [];
    this.datosObtenidos = '';

    if (this.tipoBuscador == 'Tiendas' && this.palabraBuscadora != '') {
      console.log('==================================================');
      let response = await this._tiendaServicio.obtenerFiltroPrincipalTienda(this.palabraBuscadora).toPromise();
      this.datosObtenidos = response.data;
      console.log('hola' + JSON.stringify(this.datosObtenidos));
      this.datosObtenidos.forEach(elemnt => {
        this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL)
      })
      console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARTIENDA' + JSON.stringify(this.objetoDatos));
    }

    if (this.tipoBuscador == 'Productos' && this.palabraBuscadora != '') {
      console.log('==================================================');
      let response = await this._tiendaServicio.obtenerFiltroPrincipalProductos(this.palabraBuscadora).toPromise();
      this.datosObtenidos = response.data;
      console.log('hola' + JSON.stringify(this.datosObtenidos));
      this.datosObtenidos.forEach(elemnt => {
        this.objetoDatos.push(elemnt.NOMBRE_PRODUCTO)
      })
      console.log('OBJETO CON TODOS LOS NOMBRES A MOSTRARPRODUCTOS' + JSON.stringify(this.objetoDatos));
    }

    if (this.tipoBuscador == 'Todos' && this.palabraBuscadora != '') {
      console.log('==================================================');
      let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(this.palabraBuscadora).toPromise();
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

  buscarDatosTerm = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? [] :
        this.objetoDatos.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 30))
    )

  public buscarPalabra(palabraBuscada: string) {
  
    if (palabraBuscada == " " || palabraBuscada == null) {
      this.router.navigate(['**']);
    } else {
      this.router.navigate(['principales/menu/busqueda/', palabraBuscada]);
    }
  }

  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){return false;};
    let currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
  }


}
