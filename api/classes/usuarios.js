

class Usuarios {

    constructor() {
       this.personas = []
    }

    agregarPersona(id, cod_agente, tiendas) {
        let persona = {id, cod_agente, tiendas};
        this.personas.push(persona);
        return this.personas

    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];
        return persona
    }

   getPersonas(){

        return this.personas
    }

     gerPersonasPorSala(sala){

     }

     borrarPersona(id){
        let personaBorrada = this.getPersona(id);
        this.personas=this.personas.filter(persona=>{
            return persona.id !=id;
        });
      }

}

module.exports={
    Usuarios,
}
