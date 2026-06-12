import { sequelize, conexionDB } from "../../models/config.js";
import { ejecutarSeed } from "../seeds.js"

async function init() {
    try {
        console.log("--- Iniciando inicialización de BD ---");
        
        await conexionDB(); 
        
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