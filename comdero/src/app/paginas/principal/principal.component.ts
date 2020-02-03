import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  providers: [NgbCarouselConfig]
})
export class PrincipalComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  /*images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/2000/400`);*/
  images=["../../../assets/estilos-principal/images/bannerPrincipal.png",];


  // tslint:disable-next-line: max-line-length

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
  }

}
