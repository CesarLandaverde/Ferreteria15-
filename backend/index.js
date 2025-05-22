import app from "./app.js"; //
import "./database.js";
import dotenv from "dotenv";

dotenv.config();

import { config } from "./src/config.js"; // Importo la configuracion de la base de datos

// Función principal para iniciar el servidor
async function main() {
  const port = config.server.port; 
  app.listen(port); 
  console.log("Server on port", port); 
}

// Ejecuta la función principal
main();