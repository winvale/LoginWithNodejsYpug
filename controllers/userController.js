import { check, validationResult } from "express-validator";
import Users from "../models/Users.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/email.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  console.log(req.csrfToken());
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

  await check("repetir_Password")
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      }
      return false;
    })
    .withMessage("Las contraseñas no coinciden.")
    .run(req);

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

  //extraer datos

  const { nombre, email, password } = req.body;

  //verificar que usuario si existe
  const existeUsuario = await Users.findOne({
    where: { email },
  });
  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El usuario ya esta registrado con el correo " }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  //const usuario = await Users.create(req.body);
  //res.json(usuario);
  //res.json(resultado.array());

  // almacenar un usuario
  const usuario = await Users.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  //envia mail de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  // mostrar mensaje de confirmacion
  res.render("templates/mensajes", {
    pagina: "Cuenta Creada Correctamente ",
    mensajes: "Hemos enviado un Email de confirmacion, presiona el enlace",
  });
};
//confirmar cuenta
const confirmar = async (req, res, next) => {
  const { token } = req.params;

  //verificar si tk es valido
  const usuario = await Users.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar cuenta ",
      mensajes: "Hubo un error , intenta de nuevo",
      error: true,
    });
  }

  //confimar cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmanda ",
    mensajes: "Tu cuenta se confirmo exitosamente",
  });

  console.log(usuario);
  next();
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
  confirmar,
  registrar,
};
