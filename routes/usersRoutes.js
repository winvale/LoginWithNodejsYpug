import express from "express";
import { formularioLogin } from "../controllers/userController.js";

const router = express.Router();

//Routing
router.get("/login", (req, res) => {
  res.render("auth/login");
});

export default router;
