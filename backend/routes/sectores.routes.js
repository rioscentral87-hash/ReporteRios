const express = require("express");
const router = express.Router();
const Sector = require("../models/Sector");
const Usuario = require("../models/Usuario");

/* ===========================
   GET - TODOS LOS SECTORES
=========================== */
router.get("/", async (req, res) => {
  try {
    const sectores = await Sector.find();
    res.json(sectores);
  } catch (e) {
    res.status(500).json({ message: "Error obteniendo sectores" });
  }
});

/* ===========================
   GET - SECTOR POR NÚMERO
=========================== */
router.get("/:numero", async (req, res) => {
  try {
    const sector = await Sector.findOne({
      sector: Number(req.params.numero)
    });

    if (!sector) {
      return res.status(404).json({ message: "Sector no encontrado" });
    }

    res.json(sector);
  } catch (e) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

/* ===========================
   POST - CREAR SECTOR + USUARIO
=========================== */
router.post("/", async (req, res) => {
  try {
    const {
      sector,
      supervisor,
      tipoSupervisor,
      redes,
      password // 👈 VIENE DEL MODAL
    } = req.body;

    if (!sector || !supervisor || !password) {
      return res.status(400).json({
        message: "Sector, supervisor y password son obligatorios"
      });
    }

    // 🔒 Verificar si ya existe el sector
    const existeSector = await Sector.findOne({ sector });
    if (existeSector) {
      return res.status(400).json({ message: "El sector ya existe" });
    }

    // 🔒 Verificar si ya existe el usuario
    const existeUsuario = await Usuario.findOne({ nombre: supervisor });
    if (existeUsuario) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese nombre"
      });
    }

    // ✅ Crear Sector
    const nuevoSector = await Sector.create({
      sector,
      supervisor,
      tipoSupervisor,
      redes
    });

    // ✅ Crear Usuario Supervisor
    await Usuario.create({
      nombre: supervisor,
      password,
      rol: "SUPERVISOR",
      sector
    });

    res.json({
      message: "Sector y usuario creados correctamente",
      sector: nuevoSector
    });
  } catch (error) {
    console.error("ERROR CREANDO SECTOR:", error);
    res.status(500).json({ message: "Error creando sector" });
  }
});

/* ===========================
   PUT - ACTUALIZAR SECTOR
=========================== */
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Sector.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(actualizado);
  } catch (e) {
    res.status(500).json({ message: "Error actualizando sector" });
  }
});

module.exports = router;




