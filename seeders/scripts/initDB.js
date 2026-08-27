import { sequelize, conexionDB } from "../../models/config.js";
import Comentario from "../../models/Comentario.js";
import Tag from "../../models/Tag.js";
import PublicacionTag from "../../models/PublicacionTag.js";
import { DenunciaImagen } from "../../models/DenunciaImagen.js";
import { DenunciaComentario } from "../../models/DenunciaComentarios.js";
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