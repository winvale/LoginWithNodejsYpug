import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Users = db.define("usuarios", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  token: DataTypes.STRING,
  confirmado: DataTypes.BOOLEAN,
});

export default Users;
