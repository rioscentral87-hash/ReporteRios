const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reporte = require("../models/Reporte");
const auth = require("../middlewares/auth");
const { getSemanaActual } = require("../utils/fecha");

/* ======================================================
   🟢 RUTAS GENERALES
====================================================== */

// Obtener todos los reportes (PASTOR)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});

// Reporte semanal (PASTOR)
router.get("/semana", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error reporte semana:", error);
    res.status(500).json({ message: "Error obteniendo reporte semana" });
  }
});

// Crear reportes (SUPERVISOR)
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

/* ======================================================
   🔥 BULK COMITÉ
====================================================== */

router.put("/revision-comite-bulk", async (req, res) => {
  try {
    const { revisiones, comiteRevisor } = req.body;

    if (!Array.isArray(revisiones)) {
      return res.status(400).json({ message: "Revisiones inválidas" });
    }

    for (const r of revisiones) {
      if (!r.id || !mongoose.Types.ObjectId.isValid(r.id)) {
        console.log("❌ ID inválido:", r.id);
        continue;
      }

      if (!r.estado) {
        console.log("❌ Estado inválido:", r);
        continue;
      }

      await Reporte.findByIdAndUpdate(r.id, {
        estadoComite: r.estado,
        comiteRevisor,
        fechaRevision: new Date()
      });
    }

    res.json({ message: "Revisión guardada correctamente" });

  } catch (e) {
    console.error("🔥 ERROR REAL:", e);
    res.status(500).json({ message: "Error guardando revisión comité" });
  }
});

/* ======================================================
   🟢 COMITÉ CONSULTAS
====================================================== */

router.get("/pendientes-comite", async (req, res) => {
  try {
    const reportes = await Reporte.find({
      estadoComite: "PENDIENTE"
    }).sort({ createdAt: 1 });

    res.json(reportes);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo reportes pendientes"
    });
  }
});

router.get("/pendientes-comite-semana", async (req, res) => {
  try {
    const semanaActual = getSemanaActual();
    const semanaRevision = semanaActual - 1;

    const reportes = await Reporte.find({
      semana: semanaRevision,
      estadoComite: "PENDIENTE"
    }).sort({ sector: 1 });

    res.json({
      semana: semanaRevision,
      reportes
    });
  } catch (e) {
    res.status(500).json({ message: "Error cargando revisión semanal" });
  }
});

router.get("/historial-comite", async (req, res) => {
  try {
    const reportes = await Reporte.find({
      estadoComite: { $ne: "PENDIENTE" }
    }).sort({ fechaRevision: -1 });

    res.json(reportes);
  } catch (e) {
    res.status(500).json({ message: "Error cargando historial comité" });
  }
});

/* ======================================================
   🟢 FILTROS
====================================================== */

router.get("/sector/:sector", async (req, res) => {
  try {
    const sector = Number(req.params.sector);
    const { supervisor, fecha } = req.query;

    if (!supervisor) {
      return res.status(400).json({
        message: "El nombre del supervisor es obligatorio"
      });
    }

    const filtro = { sector, supervisor };
    if (fecha) filtro.fecha = fecha;

    const reportes = await Reporte.find(filtro).sort({ fecha: 1 });

    res.json(reportes);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});

/* ======================================================
   🟢 RUTAS DINÁMICAS (SIN REGEX ❌)
====================================================== */

// Revisar uno (COMITÉ)
router.put(
  "/:id/revision-comite",
  auth(["COMITE"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { accion, comiteRevisor } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      if (!accion || !comiteRevisor) {
        return res.status(400).json({
          message: "Acción y comité son obligatorios"
        });
      }

      const estado = accion === "CONFIRMAR"
        ? "CONFIRMADO"
        : "RECHAZADO";

      const reporte = await Reporte.findByIdAndUpdate(
        id,
        {
          estadoComite: estado,
          revisadoPorComite: true,
          comiteRevisor,
          fechaRevisionComite: new Date()
        },
        { new: true }
      );

      res.json(reporte);
    } catch (e) {
      res.status(500).json({ message: "Error revisando reporte" });
    }
  }
);

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const eliminado = await Reporte.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error eliminando reporte" });
  }
});

module.exports = router;
