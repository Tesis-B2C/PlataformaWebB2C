import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  public contactForm3: FormGroup;

  // tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
    this.contactForm3 = this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      message: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)])
    });
  }
}
