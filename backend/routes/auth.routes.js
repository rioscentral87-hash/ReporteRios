const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

/* ======================================================
   🔐 LOGIN
   ====================================================== */
router.post("/login", async (req, res) => {
  try {
    let { rol, nombre, password, sector, tipoSupervisor } = req.body;

    if (!rol || !password) {
      return res.status(400).json({
        message: "Rol y contraseña son obligatorios"
      });
    }

    // Normalizar sector si viene
    if (sector !== undefined) {
      sector = Number(sector);
    }

    let filtro;

    /* ======================
       LOGIN PASTOR
    ====================== */
    if (rol === "PASTOR") {
      filtro = {
        rol: "PASTOR",
        password
      };
    }

    /* ======================
       LOGIN COMITE
    ====================== */
    else if (rol === "COMITE") {
      filtro = {
        rol: "COMITE",
        password
      };
    }

    /* ======================
       LOGIN SUPERVISOR
    ====================== */
    else if (rol === "SUPERVISOR") {
      if (!nombre || sector === undefined || !tipoSupervisor) {
        return res.status(400).json({
          message: "Datos incompletos para supervisor"
        });
      }

      filtro = {
        nombre,
        password,
        rol: "SUPERVISOR",
        sector,
        tipoSupervisor
      };
    }

    /* ======================
       ROL INVÁLIDO
    ====================== */
    else {
      return res.status(400).json({
        message: "Rol no válido"
      });
    }

    console.log("🔐 LOGIN FILTRO:", filtro);

    const usuario = await Usuario.findOne(filtro).lean();

    if (!usuario) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

/* ======================================================
   🟢 LISTAR SUPERVISORES (PARA LOGIN)
   ====================================================== */
router.get("/supervisores", async (req, res) => {
  try {
    const supervisores = await Usuario.find(
      { rol: "SUPERVISOR" },
      {
        nombre: 1,
        sector: 1,
        tipoSupervisor: 1
      }
    ).sort({ nombre: 1 });

    res.json(supervisores);
  } catch (e) {
    console.error("❌ Error listando supervisores:", e);
    res.status(500).json({ message: "Error listando supervisores" });
  }
});

/* ======================================================
   🆕 CREAR USUARIO
   ====================================================== */
router.post("/crear-usuario", async (req, res) => {
  try {
    let { nombre, password, rol, sector, tipoSupervisor } = req.body;

    if (!nombre || !password || !rol) {
      return res.status(400).json({
        message: "Nombre, rol y contraseña son obligatorios"
      });
    }

    // Normalizar sector
    if (sector !== undefined) {
      sector = Number(sector);
    }

    const existe = await Usuario.findOne({
      nombre,
      rol,
      sector,
      tipoSupervisor
    });

    if (existe) {
      return res.status(400).json({
        message: "Ya existe un usuario con esos datos"
      });
    }

    const usuario = new Usuario({
      nombre,
      password,
      rol,
      sector,
      tipoSupervisor
    });

    await usuario.save();

    res.json(usuario);
  } catch (e) {
    console.error("❌ Error creando usuario:", e);
    res.status(500).json({ message: "Error creando usuario" });
  }
});

module.exports = router;
