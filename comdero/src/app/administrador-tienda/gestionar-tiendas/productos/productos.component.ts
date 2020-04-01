import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  public htmlcomponent;


  public editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "200px",
    "minHeight": "150px",
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
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
    ]
  }


  constructor() {
  }

  ngOnInit() {
  }

  images = [];

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);


        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  public data: any = [];

  public fileChangeListener($event) {
    let fileList: FileList = $event.target.files;
    this.data = {};
    if (fileList.length > 0) {
      let file: File = fileList[0];
      console.log('video seleccionado', file);
      let myReader: FileReader = new FileReader();
      let that = this;
      myReader.onloadend = (loadEvent: any) => {
        console.log('video', myReader.result);
        this.data.video = myReader.result;
        this.data.type = file.type;
      };
      myReader.readAsDataURL(file);

    }
  }

  quitar(images: any, event) {
    console.log("as", images, this.images);
    this.images.splice(images, 1);
    console.log("cortado", this.images);


  }

}
