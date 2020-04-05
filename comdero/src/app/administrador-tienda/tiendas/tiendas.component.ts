import {AfterContentInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css']
})
export class TiendasComponent implements OnInit,AfterContentInit {
public banderMensaje:boolean=false;
  constructor() { }

  ngOnInit() {
  }
 ngAfterContentInit(): void {
    this.banderMensaje=true;
 }

}
