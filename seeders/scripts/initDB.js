import { sequelize, conexionDB } from "../../models/config.js";
import "../../models/Comentario.js";
import "../../models/Tag.js";
import  "../../models/PublicacionTag.js";
import '../../models/DenunciaImagen.js';
import '../../models/DenunciaComentarios.js';
import '../../models/Mensaje.js';
import { ejecutarSeed } from "../seeds.js"

async function init() {
    try {
        console.log("--- Inicialización de BD ---");
        await conexionDB(); 
        
        await sequelize.sync({force:true});

        console.log("--- Ejecutando seeders ---");
        await ejecutarSeed();
        
        console.log("--- ¡Todo listo! Base de datos inicializada ---");
        process.exit(0);
    } catch (error) {
        console.error("Error en la inicialización:", error);
        process.exit(1);
    }
}

init();