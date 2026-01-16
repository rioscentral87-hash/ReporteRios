const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");

// 🟢 OBTENER TODOS LOS REPORTES (PASTOR)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});
// 🟢 REPORTE SEMANAL (PASTOR)
router.get("/semana", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error reporte semana:", error);
    res.status(500).json({ message: "Error obteniendo reporte semana" });
  }
});
// 🟢 CREAR REPORTES (SUPERVISOR)
router.post("/", async (req, res) => {
  try {
    const reportes = req.body;

    if (!Array.isArray(reportes)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    await Reporte.insertMany(reportes);
    res.json({ message: "Reportes guardados correctamente" });
  } catch (error) {
    console.error("Error guardando reportes:", error);
    res.status(500).json({ message: "Error guardando reportes" });
  }
});

// 🟢 HISTORIAL POR SECTOR (SUPERVISOR)
router.get("/sector/:sector", async (req, res) => {
  try {
    const sector = Number(req.params.sector);
    const { fecha } = req.query;

    const filtro = { sector };
    if (fecha) filtro.fecha = fecha;

    const reportes = await Reporte.find(filtro);
    res.json(reportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});



module.exports = router;
