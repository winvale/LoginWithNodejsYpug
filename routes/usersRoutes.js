import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
} from "../controllers/userController.js";

const router = express.Router();

//Routing
router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", confirmar);

router.get("/confirmar/:token", confirmar);

router.get("/olvide-password", formularioOlvidePassword);

export default router;
