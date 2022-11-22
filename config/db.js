import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS ?? "",
  {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: "mysql",
    define: {
      timestamps: true,
    },
    //configuracion para conexiones nuevas las conexiones consumen muchos recursos
    //mantener las conexiones que esten vivas debe reutilizar y no cree una nueva
    pool: {
      max: 5, //las conexiones que una persona realiza por usuario
      min: 0, // cuando no hay activiadad en el sitio se liberar recursos
      acquire: 30000, //30s para conectarse antes de marcar el error
      idle: 10000, // no hay visistas da 10s para que la conexion se finalice
    },
    operatorsAliases: false,
  }
);

export default db;
