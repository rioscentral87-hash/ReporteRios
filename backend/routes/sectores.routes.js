const express = require("express");
const router = express.Router();
const Sector = require("../models/Sector");

/* ===========================
   GET - TODOS LOS SECTORES
=========================== */
router.get("/", async (req, res) => {
  try {
    const sectores = await Sector.find();
    res.json(sectores);
  } catch (e) {
    console.error("❌ Error obteniendo sectores:", e);
    res.status(500).json({ message: "Error obteniendo sectores" });
  }
});

/* ===========================
   GET - SECTOR POR NÚMERO + TIPO (OBLIGATORIO)
=========================== */
router.get("/:numero", async (req, res) => {
  try {
    const numero = Number(req.params.numero);
    const { tipoSupervisor } = req.query;

    console.log("🔍 Buscando sector:", {
      sector: numero,
      tipoSupervisor
    });

    if (!tipoSupervisor) {
      return res.status(400).json({
        message: "tipoSupervisor es obligatorio para buscar un sector"
      });
    }

    const sector = await Sector.findOne({
      sector: numero,
      tipoSupervisor
    });

    if (!sector) {
      return res.status(404).json({
        message: "Sector no encontrado",
        debug: { sector: numero, tipoSupervisor }
      });
    }

    res.json(sector);
  } catch (e) {
    console.error("❌ Error buscando sector:", e);
    res.status(500).json({ message: "Error del servidor" });
  }
});

/* ===========================
   POST - CREAR SECTOR / SUPERVISOR
=========================== */
router.post("/", async (req, res) => {
  try {
    const { sector, supervisor, tipoSupervisor, redes } = req.body;

    if (!sector || !supervisor || !tipoSupervisor) {
      return res.status(400).json({
        message: "Sector, supervisor y tipoSupervisor son obligatorios"
      });
    }

    const sectorNum = Number(sector);

    if (isNaN(sectorNum) || sectorNum <= 0) {
      return res.status(400).json({
        message: "El sector debe ser un número válido"
      });
    }

    // 🔒 VALIDAR DUPLICADO sector + tipoSupervisor
    const existe = await Sector.findOne({
      sector: sectorNum,
      tipoSupervisor
    });

    if (existe) {
      return res.status(400).json({
        message: `Ya existe el sector ${sectorNum} para el tipo ${tipoSupervisor}`
      });
    }

    const nuevoSector = new Sector({
      sector: sectorNum,
      supervisor,
      tipoSupervisor,
      redes: redes || []
    });

    await nuevoSector.save();

    res.json(nuevoSector);
  } catch (e) {
    console.error("❌ Error creando sector:", e);
    res.status(500).json({ message: "Error creando sector" });
  }
});

module.exports = router;
