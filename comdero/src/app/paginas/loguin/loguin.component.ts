import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ControlContainer} from "@angular/forms";

@Component({
  selector: 'app-loguin',
  templateUrl: './loguin.component.html',
  styleUrls: ['./loguin.component.css']
})
export class LoguinComponent implements OnInit {
  public contactForm2: FormGroup;

  // tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor() {
    this.contactForm2 = this.createForm();
  }
  createForm()
  {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),

    });
  }
  ngOnInit() {
  }
  onSaveForm(): void {
    if (this.contactForm2.valid) {

     console.log("correcto");
    }
  }
}
