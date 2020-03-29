import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestionar-tienda',
  templateUrl: './gestionar-tienda.component.html',
  styleUrls: ['./gestionar-tienda.component.css']
})
export class GestionarTiendaComponent  {
  private _opened: boolean = true;
  private _modeNum: number = 1;
  private _positionNum: number = 0;
  private _animate: boolean = true;
  private _autoCollapseHeight: number = null;
  private _autoCollapseWidth: number = 500;
  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

  private _toggleOpened(): void {
    this._opened = !this._opened;
  }



  private _onOpenStart(): void {
    console.info('Sidebar opening');
  }

  private _onOpened(): void {
    console.info('Sidebar opened');
  }

  private _onCloseStart(): void {
    console.info('Sidebar closing');
  }

  private _onClosed(): void {
    console.info('Sidebar closed');
  }


}
