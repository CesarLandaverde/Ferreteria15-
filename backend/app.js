// Importo todo lo de la libreria de Express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import reviewRoutes from "./src/routes/reviews.js";
import registerEmployeesRoutes from "./src/routes/registerEmployee.js";
import cookieParser from "cookie-parser";
import loginRoute from "./src/routes/login.js";
import logoutRoute from "./src/routes/logout.js";
import registerClientsRouter from "./src/routes/registerClients.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import providersRoutes from "./src/routes/providers.js";
import brandRoutes from "./src/routes/brand.js";

import cors from "cors";

// Creo una constante que es igual a la libreria que importé
const app = express();

// Configuración de CORS
const allowedOrigins = [
  "https://ferreteria15.vercel.app",
  "https://ferreteria15-rsq7-git-master-cesarlandaverdes-projects.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));

///dlshfljdsf
//Que acepte datos en json
app.use(express.json());
// Para que postman guarde el token en una cookie
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/registerEmployee", registerEmployeesRoutes);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);

app.use("/api/registerClients", registerClientsRouter);

app.use("/api/RecoveryPassword", recoveryPasswordRoutes);

app.use("/api/providers",providersRoutes);
app.use("/api/products/brands", brandRoutes);


// Ruta de health check
app.get('/api/products/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Exporto la constante para poder usar express en otros archivos
export default app;
