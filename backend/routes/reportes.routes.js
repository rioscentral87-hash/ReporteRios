const express = require("express");
const router = express.Router();
const Reporte = require("../models/Reporte");
const auth = require("../middlewares/auth");
const { getSemanaActual } = require("../utils/fecha");

// OBTENER TODOS LOS REPORTES (PASTOR)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});
//  REPORTE SEMANAL (PASTOR)
router.get("/semana", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    console.error("Error reporte semana:", error);
    res.status(500).json({ message: "Error obteniendo reporte semana" });
  }
});
//  CREAR REPORTES (SUPERVISOR)
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

// OBTENER REPORTES POR SECTOR  (SUPERVISOR)
router.get("/sector/:sector", async (req, res) => {
  try {
    const sector = Number(req.params.sector);
    const { supervisor, fecha } = req.query;

    if (!supervisor) {
      return res.status(400).json({
        message: "El nombre del supervisor es obligatorio"
      });
    }

    const filtro = {
      sector,
      supervisor
    };

    if (fecha) filtro.fecha = fecha;

    const reportes = await Reporte.find(filtro).sort({ semana: 1 });

    res.json(reportes);

  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
});


// ELIMINAR REPORTE POR ID
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Reporte.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando reporte:", error);
    res.status(500).json({ message: "Error eliminando reporte" });
  }
});

// ACTUALIZAR REPORTE (SUPERVISOR)
router.put("/:id", async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id);

    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    // Validamos semana actual
    const semanaActual = getSemanaActual();

    if (reporte.semana !== semanaActual - 1) {
      return res.status(403).json({
        message: "Solo se puede editar el reporte de la semana actual"
      });
    }

    // Validamos estado comité
    if (reporte.estadoComite !== "PENDIENTE") {
      return res.status(403).json({
        message: "No se puede editar un reporte ya revisado por el comité"
      });
    }

    // Actualizamos campos
    const actualizado = await Reporte.findByIdAndUpdate(
      req.params.id,
      {
        infoIglesia: req.body.infoIglesia,
        infoCelula: req.body.infoCelula
      },
      { new: true }
    );

    res.json(actualizado);

  } catch (error) {
    console.error("Error actualizando reporte:", error);
    res.status(500).json({ message: "Error actualizando reporte" });
  }
});

// se acaba de agregar para validacion del comite
router.put("/:id/revision-comite", async (req, res) => {
  try {
    const { accion, comiteRevisor } = req.body;

    if (!accion || !comiteRevisor) {
      return res.status(400).json({
        message: "Acción y nombre del comité son obligatorios"
      });
    }

    const estado =
      accion === "CONFIRMAR" ? "CONFIRMADO" : "RECHAZADO";

    const reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
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
});

// SOLO COMITE puede revisar
router.put(
  "/:id/revision-comite",
  auth(["COMITE"]),
  async (req, res) => {
    // lógica de revisión
  }
);

/* ======================================================
   REPORTES PENDIENTES PARA COMITÉ
   ====================================================== */
router.get("/pendientes-comite", async (req, res) => {
  try {
    const reportes = await Reporte.find({
      estadoComite: "PENDIENTE"
    }).sort({ createdAt: 1 });

    res.json(reportes);
  } catch (error) {
    console.error("❌ Error obteniendo reportes comité:", error);
    res.status(500).json({
      message: "Error obteniendo reportes pendientes del comité"
    });
  }
});

router.get("/pendientes-comite-semana", async (req, res) => {
  try {
    const semanaActual = getSemanaActual()-1; // helper
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

router.put("/revision-comite-bulk", async (req, res) => {
  try {
    const { revisiones, comiteRevisor } = req.body;

    for (const r of revisiones) {
      await Reporte.findByIdAndUpdate(r.id, {
        estadoComite: r.estado,
        comiteRevisor,
        fechaRevision: new Date()
      });
    }

    res.json({ message: "Revisión guardada correctamente" });
  } catch (e) {
    res.status(500).json({ message: "Error guardando revisión comité" });
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


module.exports = router;
