const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");

router.get("/reportes", async (req, res) => {
  const reportes = await Reporte.find().sort({ fecha: -1 });
  res.json(reportes);
});

module.exports = router;


