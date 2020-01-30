import { Component, OnInit, DoCheck } from '@angular/core';
import {FormControl, FormGroup, Validators, ControlContainer} from "@angular/forms";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit ,DoCheck {
  public bandetTipo;
  public contactForm: FormGroup;

  //tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private soloLetrasPattern:any = /[ A-Za-zñÑ]/
  private  LetrasNumeros:any = /[A-Za-zñÑ0-9]/
  private soloNumerosPattern: any =/[0-9]/
  constructor() {
    this.contactForm = this.createForm();
  }
  createForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.soloLetrasPattern)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(this.soloLetrasPattern)]),
      razonSocial: new FormControl('', [Validators.required, Validators.pattern(this.LetrasNumeros)]),
      cedula: new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(10), Validators.pattern(this.soloNumerosPattern)]),
      ruc: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.soloNumerosPattern)]),
      celular: new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(10), Validators.pattern(this.soloNumerosPattern)]),
      provincia: new FormControl('', [Validators.required, Validators.pattern(this.soloLetrasPattern)]),
      ciudad: new FormControl('', [Validators.required, Validators.pattern(this.soloLetrasPattern)]),
      callePrincipal: new FormControl('', [Validators.required]),
      calleSecundaria: new FormControl('', [Validators.required]),
      codigoPostal: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordR: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  ngOnInit() {
  this.bandetTipo=true;
  }
  ngDoCheck()
  {

  }
selectAdminsitrador()
  {
  this.bandetTipo = !this.bandetTipo;
  console.log(this.bandetTipo);
  }
}
