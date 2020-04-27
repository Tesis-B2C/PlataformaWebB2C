/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     09/04/2020 18:40:40                          */
/*==============================================================*/


drop table if exists AGENTE;
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
