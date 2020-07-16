import { Component, OnInit } from '@angular/core';
import {Tienda} from "../../../modelos/tienda";

@Component({
  selector: 'app-personalizacion-tienda',
  templateUrl: './personalizacion-tienda.component.html',
  styleUrls: ['./personalizacion-tienda.component.css']
})
export class PersonalizacionTiendaComponent implements OnInit {
  public Tienda;
  constructor() { }

  ngOnInit() {
    this.Tienda = new Tienda(null, null, null, null, null,
      null, null, null, null, 1, null, 'No disponible');
  }

  //Logo
  public filesToUpload;
  public urlLogo;

  public async subirLogo(event: any) {
    this.filesToUpload = <Array<File>>event.target.files;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlLogo = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public quitarLogo() {
    this.urlLogo = "";
    this.Tienda.Logo="";

  }


  //Banner
  public filesToUpload2;
  public urlBanner;

  public async subirBanner(event: any) {
    this.filesToUpload2 = <Array<File>>event.target.files;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlBanner = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public quitarBanner() {
    this.urlBanner = "";
    this.Tienda.Banner="";
  }

}
