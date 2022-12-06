import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Users from "../models/Users.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  await check("email").isEmail().withMessage("Correo es obligatorio").run(req);

  await check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  //return res.json(resultado.array());

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  const { email, password } = req.body;
  // comprobar si el usuario existe
  const usuario = await Users.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no existe" }],
    });
  }

  // reivisar el password
};

const formularioRegistro = (req, res) => {
  console.log(req.csrfToken());
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),

    // csrfToken: req.csrfToken(),
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
  //.equals("repetir_Password")
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

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("No es un correo valido").run(req);

  let resultado = validationResult(req);

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  //Buscar Usuario
  const { email } = req.body;
  const usuario = await Users.findOne({ where: { email } });
  console.log(usuario);

  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no pertenece a ningun usuario registrado" }],
    });
  }

  //generar un token y enviar email
  usuario.token = generarId();
  await usuario.save();

  //Enviar un email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });
  //Rendereizar mensaje
  res.render("templates/mensajes", {
    pagina: " Se restablece tu cuenta Correctamente ",
    mensajes: "Hemos enviado un Email con las instruciones, presiona el enlace",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Users.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Restablece tu password",
      mensajes: "Hubo un error al validar tu informacion, intenta de nuevo",
      error: true,
    });
  }
  //mostrar formulaio para modificar tu password
  res.render("auth/reset-password", {
    pagina: "Restablece tu password",
    csrfToken: req.csrfToken(),
  });
};
const nuevoPassword = async (req, res) => {
  //validar passw
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser superior a 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  //return res.json(resultado.array());

  // verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Restablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  //identificar quien hace el cambio
  const usuario = await Users.findOne({ where: { token } });

  //hasherar el nuevo password
  const salto = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salto);
  usuario.token = null;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Password Reestablecido",
    mensajes: "El password se guardo correctamente",
  });
};
export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
