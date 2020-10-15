# PlataformaWebB2C

lo primero que se instala 
npm install rxjs@latest --save
npm install @ng-bootstrap/ng-bootstrap --save 


// mejorar el select 

----incluir esto en el index para que el select sea de otro tipo
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.min.css">


--------Servicio "api" correo----------
npm install nodemailer // correo electronico


--- libreria para sidebar
npm i ng-sidebar
https://stackblitz.com/edit/ng-sidebar-demo


---- para el editor de texto de la descripcion de productos
npm install ngx-editor --save
npm i ngx-bootstrap
https://sibiraj.dev/ngx-editor/additional-documentation/configuration.html


------------ buenos estilos de scroll
https://www.zkreations.com/2018/02/personalizar-scrollbar-facil-custom-scrollbars.html#style-2


------- UTILIZAR EL WIZARD DE REGISTRO TIENDA
       npm i angular-archwizard@5.0.0
       https://www.npmjs.com/package/angular-archwizard/v/5.0.0
       npm i angular-archwizard@5.0.1
       https://www.npmjs.com/package/angular-archwizard/v/5.0.1

---- MAPBOX MAPAS
https://www.youtube.com/watch?v=gdKWeboPxgY
npm install mapbox-gl --save



----------- para la paleta de colores
            npm i ngx-color-picker
https://www.npmjs.com/package/ngx-color-picker



------------ para los toast
npm i ngx-toastr --save
npm install @angular/animations --save
@import '~ngx-toastr/toastr';
https://www.npmjs.com/package/ngx-toastr



---------------- SUbir archivos "api"----------------
npm install multer --save
npm install uuid --save // encriptar nombres
npm install fs-extra --save // permite utilizar file system de forma asyncrona
https://www.npmjs.com/package/multer
https://www.npmjs.com/package/uuid

------------PARA EL SLIDER CAROUSEL PRODUCTOS
npm i ngx-owl-carousel-o@2.1.1 --save
https://www.npmjs.com/package/ngx-owl-carousel-o#plugins

--------------- para el calendario 
debe estar instalado ngx-bootstrap 
agregar en el style p[rincipal
@import "../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css";]
https://valor-software.com/ngx-bootstrap/#/datepicker


-------- Para el Buscador
ng add ngx-bootstrap  --component typeahead
https://valor-software.com/ngx-bootstrap/#/typeahead

-----active guards
ng g guard shared/guards/auth

---cahce servidor
npm i memory-cache --save
video 94 la biblia de nodejs

---spinner 
npm i ngx-spinner
https://www.npmjs.com/package/ngx-spinner
https://napster2210.github.io/ngx-spinner/

---paypal cliente 
En el cliente osea en angular instalar para agregar el pago online
npm i ngx-paypal --save
modificar en la libreria nodemoudles/lib/componentes/paypal.component quitar el set


== PARA LAS HORASB Y FECHAS
npm install moment --save


----- para exportar tablas excel
npm install xlsx
npm install file-server
https://medium.com/@patade888/exporting-data-to-excel-in-angular-8-5a7cf5d0d25d


------- graficas
npm i chart.js
npm i ng2-charts@2.0.0-beta.9


--- BARRA DE CARGA
  npm i @ngx-loading-bar/core@4.2.0 --save
  import { AppComponent } from './app';
 -- En app.component.html
  <ngx-loading-bar color="#CD67BA" height="4px"></ngx-loading-bar>
  
https://dev.to/susomejias/automatic-page-loading-progress-bar-for-angular-3ann
https://github.com/aitboudad/ngx-loading-bar/blob/main/packages/http-client/src/loading-bar.interceptor.ts





----- NOTIFICACIONES SOCKET
-- CLIENTE ANGULAR
npm i ngx-socket-io
---- SERVIDOR
npm i socket.io
https://medium.com/@leifer33/manejar-eventos-socket-io-y-angular-ad8c8f340be1
https://sodocumentation.net/es/node-js/topic/10892/notificaciones-push
VIDEO DE FERNANDO HERRERA NODEJS DE CERO A EXPERTO UDEMY




--- para imprimir pdf
npm install jspdf
npm install html2canvas
no se importa en el module principal solo donde se va a ocupar
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
https://www.youtube.com/watch?v=PgT2tnmDzzU


--problema de que no buildea
"paths": {
      "@angular/*": [ "node_modules/@angular/*"]
    },
    
    agregar en tsconfig.json
