import { check, validationResult } from "express-validator";
import Users from "../models/Users.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  // validar
  await check("nombre")
    .notEmpty()
    .withMessage("En nombre es obligatorio")
    .run(req);

  await check("email").isEmail().withMessage("No es un correo valido").run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser superior a 6 caracteres")
    .run(req);

  // await check("password")
  // .equals("repetir_Password")
  //.withMessage("No coicide la contraseña ")
  //.run(req);

  check("repetir_Password").custom((value, { req }) => {
    if (value !== req.body.password) {
      console.log("noooooooo");
      console.log(req.body.password, req.body.repetir_Password);
      throw new Error("No coicide la contraseña");
    }
    return Error;
  });

  let resultado = validationResult(req);

  //return res.json(resultado.array());
  // verificar que el resultadoeste vacio

  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  const usuario = await Users.create(req.body);
  res.json(usuario);
  //res.json(resultado.array());
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperar Contraseña",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
};
