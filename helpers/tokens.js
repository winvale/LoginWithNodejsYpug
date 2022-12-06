import jwt from "jsonwebtoken";
const generarJWT = (datos) =>
  jwt.sign(
    {
      id: datos.id,
      nombre: datos.nombre,
    },
    process.env.JWT_SECRETE,
    {
      expiresIn: "1d",
    }
  );

const generarId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring();

export { generarId, generarJWT };
