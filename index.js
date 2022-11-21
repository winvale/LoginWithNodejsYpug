import express from "express";
import usersRoutes from "./routes/usersRoutes.js";

// crear app
const app = express();

//Routing
app.use("/", usersRoutes);

//habilitar pug
app.set("view engine", "pug");
app.set("view", "/.views");

//definir puerto para arrancar

const port = 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
