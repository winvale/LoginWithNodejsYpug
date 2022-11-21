import express from "express";
import usersRoutes from "./routes/usersRoutes.js";

// crear app
const app = express();

//Routing
app.use("/", usersRoutes);
//definir puerto para arrancar

const port = 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
