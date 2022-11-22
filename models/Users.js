import sequelize, { DataType } from "sequelize";

const Users = db.define("usuarios", {
  nombre: {
    type: DataType.STRING,
    allowNull: false,
  },
  email: {
    type: DataType.STRING,
    allowNull: false,
  },
  password: {
    type: DataType.STRING,
    allowNull: false,
  },
  token: DataType.STRING,
  confirmado: DataType.BOOLEAN,
});

export default Users;
