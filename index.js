const express = require("express");

// crear app
const app = express();

//Routing
app.get("/", function (req, res) {
  res.send("prueba");
});

//definir puerto para arrancar

const port = 3000;

app.listen(port, () => {
  console.log(`el servidor por el puerto ${port}`);
});
