import express from "express";
import usersRoutes from "./routes/usersRoutes.js";

// crear app
const app = express();

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica

app.use(express.static("public"));
//Routing
app.use("/auth", usersRoutes);

//definir puerto para arrancar

const port = 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
