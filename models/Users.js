import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Users = db.define(
  "usuarios",
  {
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
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salto = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salto);
      },
    },
  }
);
//metodo personalizados
Users.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Users;
