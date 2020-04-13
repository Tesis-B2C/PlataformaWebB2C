/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     09/04/2020 18:40:40                          */
/*==============================================================*/


drop table if exists AGENTE;

drop table if exists CALIFICACION;

drop table if exists CARRITO;

drop table if exists CARRITO_PRODUCTO;

drop table if exists CATEGORIA;

drop table if exists CATEGORIA_CATEGORIA;

drop table if exists COMENTARIO;

drop table if exists COMPRA;

drop table if exists COMPRA_PRODUCTO;

drop table if exists DESCUENTO;

drop table if exists DPA;

drop table if exists IMAGEN_PRODUCTO;

drop table if exists OFERTA;

drop table if exists PRODUCTO;

drop table if exists PRODUCTO_CATEGORIA;

drop table if exists PRODUCTO_DESCUENTO;

drop table if exists SUCURSAL;

drop table if exists TIENDA;

drop table if exists VARIANTE;

/*==============================================================*/
/* Table: AGENTE                                                */
/*==============================================================*/
create table AGENTE
(
   ID_AGENTE            varchar(13) not null,
   NOMBRE               varchar(50) not null,
   TELEFONO             varchar(20) not null,
   CORREO               varchar(100) not null,
   COD_DPA              varchar(6) not null,
   TIPO                 varchar(10) not null,
   ESTADO               int not null,
   CALLE_PRINCIPAL_AGENTE varchar(100),
   CALLE_SECUNDARIA_AGENTE varchar(100),
   NUM_CASA_AGENTE      varchar(10),
   CONTRASENIA          varchar(300) not null,
   COD_POSTAL           varchar(10) not null,
   primary key (CORREO, ID_AGENTE)
);

/*==============================================================*/
/* Table: CALIFICACION                                          */
/*==============================================================*/
create table CALIFICACION
(
   ID_CALIFICACION      int not null auto_increment,
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   NUM_ESTRELLAS        int not null,
   primary key (ID_CALIFICACION)
);

/*==============================================================*/
/* Table: CARRITO                                               */
/*==============================================================*/
create table CARRITO
(
   ID_CARRITO           int not null auto_increment,
   CORREO               varchar(100) not null,
   ID_AGENTE            varchar(13) not null,
   CANTIDAD_TOTAL_PRODUCTOS int not null,
   primary key (ID_CARRITO)
);

/*==============================================================*/
/* Table: CARRITO_PRODUCTO                                      */
/*==============================================================*/
create table CARRITO_PRODUCTO
(
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   ID_CARRITO           int not null,
   CANTIDAD_PRODUCTO_CARRITO int not null,
   primary key (ID_PRODUCTO, COD_PRODUCTO, ID_CARRITO)
);

/*==============================================================*/
/* Table: CATEGORIA                                             */
/*==============================================================*/
create table CATEGORIA
(
   ID_CATEGORIA         int not null auto_increment,
   DESCRIPCION_CATEGORIA varchar(100) not null,
   FECHA_CREACION_CATEGORIA date not null,
   ESTADO_CATEGORIA     int not null,
   NOMBRE               varchar(50) not null,
   primary key (ID_CATEGORIA)
);

/*==============================================================*/
/* Table: CATEGORIA_CATEGORIA                                   */
/*==============================================================*/
create table CATEGORIA_CATEGORIA
(
   CAT_ID_CATEGORIA     int not null,
   ID_CATEGORIA         int not null,
   primary key (CAT_ID_CATEGORIA, ID_CATEGORIA)
);

/*==============================================================*/
/* Table: COMENTARIO                                            */
/*==============================================================*/
create table COMENTARIO
(
   ID_COMENTARIO        int not null auto_increment,
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   COMENTARIO           varchar(200) not null,
   primary key (ID_COMENTARIO)
);

/*==============================================================*/
/* Table: COMPRA                                                */
/*==============================================================*/
create table COMPRA
(
   NUM_COMPRA           int not null auto_increment,
   ID_AGENTE            varchar(13) not null,
   CORREO               varchar(100) not null,
   FECHA_COMPRA         datetime not null,
   CALLE_PRINCIPAL_ENTREGA varchar(100) not null,
   NUM_CASA_ENTREGA     varchar(10) not null,
   CALLE_SECUNDARIA_ENTREGA varchar(100),
   primary key (NUM_COMPRA)
);

/*==============================================================*/
/* Table: COMPRA_PRODUCTO                                       */
/*==============================================================*/
create table COMPRA_PRODUCTO
(
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   NUM_COMPRA           int not null,
   CANTIDAD             int not null,
   SUB_TOTAL            float(8,2) not null,
   SUB_TOTAL_ENVIO      float(8,2) not null,
   FECHA_ENTREGAS       date,
   FECHA_ENVIO          date,
   ESTADO_COMPRA        int not null,
   primary key (ID_PRODUCTO, COD_PRODUCTO, NUM_COMPRA)
);

/*==============================================================*/
/* Table: DESCUENTO                                             */
/*==============================================================*/
create table DESCUENTO
(
   ID_DESCUENTO         int not null auto_increment,
   MOTIVO_DESCUENTO     varchar(100) not null,
   VALOR                float not null,
   FECHA_INICIO         date not null,
   FECHA_FIN            date,
   primary key (ID_DESCUENTO)
);

/*==============================================================*/
/* Table: DPA                                                   */
/*==============================================================*/
create table DPA
(
   COD_DPA              varchar(6) not null,
   DPA_COD_DPA          varchar(6),
   NOMBRE               varchar(50) not null,
   TIPO                 varchar(10) not null,
   primary key (COD_DPA)
);

/*==============================================================*/
/* Table: IMAGEN_PRODUCTO                                       */
/*==============================================================*/
create table IMAGEN_PRODUCTO
(
   ID_IMAGEN            int not null auto_increment,
   ID_PRODUCTO          int,
   COD_PRODUCTO         varchar(100),
   NOMBRE_IMAGEN        varchar(200) not null,
   TIPO_IMAGEN          varchar(5) not null,
   IMAGEN               longblob not null,
   TAMANIO_IMAGEN       int,
   primary key (ID_IMAGEN)
);

/*==============================================================*/
/* Table: OFERTA                                                */
/*==============================================================*/
create table OFERTA
(
   ID_OFERTA            int not null auto_increment,
   NUM_TIENDA           int not null,
   ID_AGENTE            int not null,
   IVA                  float not null,
   FECHA_CREACION       date not null,
   OFRECE_ENVIO_LOCAL   int not null,
   PRECIO_ENVIO_LOCAL   float(8,2),
   OFRECE_ENVIO_EXTERNO int not null,
   PRECIO_ENVIO_EXTERNO float(8,2),
   RESERVA              int not null,
   primary key (ID_OFERTA)
);

/*==============================================================*/
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO
(
   ID_PRODUCTO          int not null auto_increment,
   COD_PRODUCTO         varchar(100) not null,
   ID_OFERTA            int not null,
   NOMBRE_PRODUCTO      varchar(20) not null,
   DESCRIPCION_PRODUCTO varchar(100) not null,
   DETALLE_PRODUCTO     varchar(1000),
   PRECIO_UNITARIO      float(8,2) not null,
   STOCK                int not null,
   MARCA                varchar(20) not null,
   ETIQUETAS_BUSUQUEDA  varchar(100) not null,
   primary key (ID_PRODUCTO, COD_PRODUCTO)
);

/*==============================================================*/
/* Table: PRODUCTO_CATEGORIA                                    */
/*==============================================================*/
create table PRODUCTO_CATEGORIA
(
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   ID_CATEGORIA         int not null,
   primary key (ID_PRODUCTO, COD_PRODUCTO, ID_CATEGORIA)
);

/*==============================================================*/
/* Table: PRODUCTO_DESCUENTO                                    */
/*==============================================================*/
create table PRODUCTO_DESCUENTO
(
   ID_DESCUENTO         int not null,
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   ID_PRODUCTO_DESCUENTO2 int not null auto_increment,
   FECHA_ASIGNACION_DESCUENTO date not null,
   ESTADO_ASIGNACION_DESCUENTO int not null,
   primary key (ID_PRODUCTO_DESCUENTO2)
);

/*==============================================================*/
/* Table: SUCURSAL                                              */
/*==============================================================*/
create table SUCURSAL
(
   NUM_SUCURSAL         int not null auto_increment,
   NUM_TIENDA           int not null,
   COD_DPA              varchar(6) not null,
   ID_AGENTE            int not null,
   CALLE_PRINCIPAL_SUCURSAL varchar(100) not null,
   TELEFONO_SUCURSAL    int not null,
   RUC                  varchar(13) not null,
   CALLE_SECUNDARIA_SUCURSAL varchar(100) not null,
   HORARIO_ATENCION     varchar(100) not null,
   COORDENADAS          varchar(100) not null,
   NUM_REFERENCIA       varchar(10),
   COD_POSTAL           varchar(10),
   primary key (NUM_SUCURSAL)
);

/*==============================================================*/
/* Table: TIENDA                                                */
/*==============================================================*/
create table TIENDA
(
   NUM_TIENDA           int not null auto_increment,
   CORREO               varchar(100) not null,
   ID_AGENTE            varchar(13) not null,
   RAZON_SOCIAL         varchar(20) not null,
   NOMBRE_COMERCIAL     varchar(20) not null,
   LINK_PAGINA          varchar(200),
   LINK_FACEBOOK        varchar(200),
   DESCRIPCION_TIENDA   varchar(100) not null,
   LOGO                 longblob not null,
   BANNER               longblob not null,
   ESTADO_TIENDA        int not null,
   TERMINOS_CONDICIONES varchar(500) not null,
   primary key (NUM_TIENDA)
);

/*==============================================================*/
/* Table: VARIANTE                                              */
/*==============================================================*/
create table VARIANTE
(
   NUM_VARIANTE         int not null,
   ID_PRODUCTO          int not null,
   COD_PRODUCTO         varchar(100) not null,
   COLOR                varchar(20),
   TALLA                varchar(2),
   MATERIAL             varchar(20),
   primary key (NUM_VARIANTE)
);

alter table AGENTE add constraint FK_DPA_AGENTE foreign key (COD_DPA)
      references DPA (COD_DPA) on delete restrict on update restrict;

alter table CALIFICACION add constraint FK_PRODUCTO_CALIFICACION foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table CARRITO add constraint FK_AGENTE_CARRITO2 foreign key (CORREO, ID_AGENTE)
      references AGENTE (CORREO, ID_AGENTE) on delete restrict on update restrict;

alter table CARRITO_PRODUCTO add constraint FK_CARRITO_CARRITO_PRODUCTO foreign key (ID_CARRITO)
      references CARRITO (ID_CARRITO) on delete restrict on update restrict;

alter table CARRITO_PRODUCTO add constraint FK_CARRITO_PRODUCTO_PRODUCTO foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table CATEGORIA_CATEGORIA add constraint FK_CATEGORIA_CATEGORIA foreign key (CAT_ID_CATEGORIA)
      references CATEGORIA (ID_CATEGORIA) on delete restrict on update restrict;

alter table CATEGORIA_CATEGORIA add constraint FK_CATEGORIA_CATEGORIA2 foreign key (ID_CATEGORIA)
      references CATEGORIA (ID_CATEGORIA) on delete restrict on update restrict;

alter table COMENTARIO add constraint FK_PRODUCTO_COMENTARIOS foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table COMPRA add constraint FK_AGENTE_COMPRA foreign key (CORREO, ID_AGENTE)
      references AGENTE (CORREO, ID_AGENTE) on delete restrict on update restrict;

alter table COMPRA_PRODUCTO add constraint FK_COMPRA_COMPRA_PRODUCTO foreign key (NUM_COMPRA)
      references COMPRA (NUM_COMPRA) on delete restrict on update restrict;

alter table COMPRA_PRODUCTO add constraint FK_COMPRA_PRODUCTO_PRODUCTO foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table DPA add constraint FK_DPA_DPA foreign key (DPA_COD_DPA)
      references DPA (COD_DPA) on delete restrict on update restrict;

alter table IMAGEN_PRODUCTO add constraint FK_PRODUCTO_IMAGENES_PRODUCTO foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table OFERTA add constraint FK_TIENDA_OFERTA foreign key (NUM_TIENDA)
      references TIENDA (NUM_TIENDA) on delete restrict on update restrict;

alter table PRODUCTO add constraint FK_OFERTA_PRODUCTO2 foreign key (ID_OFERTA)
      references OFERTA (ID_OFERTA) on delete restrict on update restrict;

alter table PRODUCTO_CATEGORIA add constraint FK_PRODUCTO_CATEGORIA foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table PRODUCTO_CATEGORIA add constraint FK_PRODUCTO_CATEGORIA2 foreign key (ID_CATEGORIA)
      references CATEGORIA (ID_CATEGORIA) on delete restrict on update restrict;

alter table PRODUCTO_DESCUENTO add constraint FK_PRODUCTO_DESCUENTO_DESCUENTOS foreign key (ID_DESCUENTO)
      references DESCUENTO (ID_DESCUENTO) on delete restrict on update restrict;

alter table PRODUCTO_DESCUENTO add constraint FK_PRODUCTO_PRODUCTO_DESCUENTO foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

alter table SUCURSAL add constraint FK_DPA_SUCURSAL foreign key (COD_DPA)
      references DPA (COD_DPA) on delete restrict on update restrict;

alter table SUCURSAL add constraint FK_TIENDA_SUCURSAL foreign key (NUM_TIENDA)
      references TIENDA (NUM_TIENDA) on delete restrict on update restrict;

alter table TIENDA add constraint FK_AGENTE_TIENDA foreign key (CORREO, ID_AGENTE)
      references AGENTE (CORREO, ID_AGENTE) on delete restrict on update restrict;

alter table VARIANTE add constraint FK_PRODUCTO_VARIANTE foreign key (ID_PRODUCTO, COD_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO, COD_PRODUCTO) on delete restrict on update restrict;

