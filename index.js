import express from "express";
import usersRoutes from "./routes/usersRoutes.js";
import db from "./config/db.js";

// crear app
const app = express();

//conexion db

try {
  await db.authenticate();
  db.sync();
  console.log("conexion establecida");
} catch (error) {
  console.log(error);
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//habilitar lectura de datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//carpeta publica

app.use(express.static("public"));
//Routing
app.use("/auth", usersRoutes);

//definir puerto para arrancar

const port = 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
