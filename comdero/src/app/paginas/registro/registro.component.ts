import {Component, OnInit, DoCheck} from '@angular/core';
import {FormControl, FormGroup, Validators, ControlContainer} from "@angular/forms";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, DoCheck {
  public bandetTipo;
  public contactForm: FormGroup;
  public passwordEntrante=null;
  //tslint:disable-next-line: max-line-length
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private soloLetrasPattern: any = /^[ a-zA-Z ][ a-zA-Z ]*$[0-9]{0}/
  private LetrasNumerosPattern: any = /^[ a-z 0-9 ][ a-z 0-9 ]*$/
  private soloNumerosPattern: any = /^[0-9][0-9]*$[A-Z]{0}/
  private passwordPattern:any = null;
  constructor() {
    this.contactForm = this.createForm();
  }

  get nombre() {
    return this.contactForm.get('nombre');
  }

  get apellido() {
    return this.contactForm.get('apellido');
  }

  get razonSocial() {
    return this.contactForm.get('razonSocial')
  }

  get cedula() {
    return this.contactForm.get('cedula')
  }

  get ruc() {
    return this.contactForm.get('ruc')
  }

  get celular() {
    return this.contactForm.get('celular')
  }

  get email() {
    return this.contactForm.get('email')
  }

  get provincia(){
    return this.contactForm.get('provincia');
  }

  get ciudad (){
    return this.contactForm.get('ciudad');
  }

  get callePrincipal (){
    return this.contactForm.get('callePrincipal');
  }

  get calleSecundaria(){
    return this.contactForm.get('calleSecundaria');
  }

  get  codigoPostal(){
    return this.contactForm.get('codigoPostal');
  }
  get  password(){
     this.passwordPattern= this.contactForm.get('password').value;
     console.log("password", this.passwordPattern);
    return this.contactForm.get('password');
  }

  get passwordR (){
    return this.contactForm.get('passwordR');
  }
  createForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      nombre: new FormControl('', [Validators.required, Validators.pattern(this.soloLetrasPattern)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(this.soloLetrasPattern)]),
      razonSocial: new FormControl('', [Validators.required, Validators.pattern(this.LetrasNumerosPattern)]),
      cedula: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.soloNumerosPattern)]),
      ruc: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern(this.soloNumerosPattern)]),
      celular: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(this.soloNumerosPattern)]),
      provincia: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      callePrincipal: new FormControl('', [Validators.required]),
      calleSecundaria: new FormControl('', [Validators.required]),
      codigoPostal: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordR: new FormControl('', [Validators.required, Validators.minLength(6),Validators.pattern(this.passwordPattern)])
    });
  }


  ngOnInit() {
    this.bandetTipo = true;
  }

  ngDoCheck() {

  }

  selectAdminsitrador() {
    this.bandetTipo = !this.bandetTipo;
    console.log(this.bandetTipo);
  }

  onResetForm(): void {
    this.contactForm.reset();
  }

  onSaveForm(): void {

    if (this.contactForm.valid) {
      this.onResetForm();

      console.log("no esta correcto");
    }

  }
}
