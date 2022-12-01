import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/usersRoutes.js";
import db from "./config/db.js";

// crear app
const app = express();

//habilitar cookis parser
app.use(cookieParser());

let csrfProtection = csrf({ cookie: true });
//habilitar CSRF
//app.use(csrf({ cookie: true }));

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
app.use("/auth", csrfProtection, usersRoutes);

//definir puerto para arrancar

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
