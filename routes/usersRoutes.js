import express from "express";

const router = express.Router();

//Routing
router.get("/", (req, res) => {
  res.json({ msg: "prueba" });
});
router.get("/home", (req, res) => {
  res.json({ msg: "home" });
});

export default router;
