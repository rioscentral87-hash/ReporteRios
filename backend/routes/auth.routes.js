const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

/* 🔐 LOGIN (YA EXISTENTE) */
router.post("/login", async (req, res) => {
  const { nombre, password } = req.body;

  const usuario = await Usuario.findOne({ nombre, password });
  if (!usuario) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  res.json(usuario);
});

/* 🆕 CREAR USUARIO (YA EXISTENTE) */
router.post("/crear-usuario", async (req, res) => {
  try {
    const { nombre, password, rol, sector } = req.body;

    const existe = await Usuario.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const usuario = new Usuario({
      nombre,
      password,
      rol,
      sector
    });

    await usuario.save();
    res.json(usuario);
  } catch (e) {
    res.status(500).json({ message: "Error creando usuario" });
  }
});

/* ✅ NUEVO: LISTAR SUPERVISORES (PARA LOGIN) */
router.get("/supervisores", async (req, res) => {
  try {
    const supervisores = await Usuario.find({
      rol: "SUPERVISOR"
    }).select("nombre sector");

    res.json(supervisores);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo supervisores" });
  }
});

module.exports = router;
