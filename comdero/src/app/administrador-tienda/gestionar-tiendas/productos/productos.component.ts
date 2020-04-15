import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public htmlcomponent;
  public url2 = "./../assets/images/imagenes-fondo.png";
  images = [];
  banderaAgregarImagen: boolean = false;
  banderaMaximoImagenes: boolean = true;
  banderaMensajeMaximoImagenes: boolean = false;
  banderaMensajeMaximoVideo: boolean = false;
  public data: any = [];
  public banderaAnimacionVideo: boolean = false;

  // banderas de envios a domicilio
  public banderaEntregaDomicilioLocalidad: boolean = false;
  public banderaEntregaDomicilioFueraLocalidad: boolean = false;
  public banderaVariaciones: boolean = true;


  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "150px",
    "minHeight": "100px",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "imageEndPoint": "",
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize",],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine"],
    ]
  }
  public vectorOpciones:Array<number>=[1]; // las dos formas swon validas pero la activa es ams facil
  /*public vectorOpciones=new Array(0);*/
  constructor() {
  }

  ngOnInit() {
  }

  public onFileChange(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      if (filesAmount > 6) {
        this.banderaMensajeMaximoImagenes = true;
      } else {
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            console.log(event.target.result);
            this.images.push(event.target.result);
            this.banderaAgregarImagen = true;
            document.forms["form"].reset();
            if (this.images.length > 6) {
              this.images = [];
              document.forms["form"].reset();
              this.banderaAgregarImagen = false;
              this.banderaMensajeMaximoImagenes = true;
            } else if (this.images.length == 6) {
              this.banderaMensajeMaximoImagenes = false
              this.banderaMaximoImagenes = false;
            }
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }


  public onVideoChange($event) {
    this.banderaAnimacionVideo = true;
    debugger
    let fileList: FileList = $event.target.files;
    this.data = {};
    if (fileList.length > 0) {
      let file: File = fileList[0];
      /*  console.log('video seleccionado', file);*/
      if (file.size < 150000000) {
        this.banderaMensajeMaximoVideo = false
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = (loadEvent: any) => {
          //  console.log('video', myReader.result);
          this.data.video = myReader.result;
          this.data.type = file.type;
          this.banderaAnimacionVideo = false;
        };
        myReader.readAsDataURL(file);
      } else {
        this.banderaAnimacionVideo = false;
        this.banderaMensajeMaximoVideo = true;
      }
    }
  }

  public quitar(images: any) {
    this.images.splice(images, 1);
    document.forms["form"].reset();
  }


  public opcionEntregaLocalidad() {

    this.banderaEntregaDomicilioLocalidad = !this.banderaEntregaDomicilioLocalidad;
    debugger
  }

  public opcionEntregaFueraLocalidad() {
    this.banderaEntregaDomicilioFueraLocalidad = !this.banderaEntregaDomicilioFueraLocalidad;
  }

  public opcionVariaciones() {
    this.banderaVariaciones=!this.banderaVariaciones;
    this.vectorOpciones=[];
  }

  public agregarOpciones(){
  this.vectorOpciones.push(1);
  }

  public borrarOpciones(pocicion:number){
  debugger
    this.vectorOpciones.splice(pocicion,1)
  }
}
