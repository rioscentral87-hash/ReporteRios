const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ LEER VARIABLES DE ENTORNO

const app = express();

app.use(cors());
app.use(express.json());

/* ===== RUTAS ===== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/sectores", require("./routes/sectores.routes"));
app.use("/api/reportes", require("./routes/reportes.routes"));
app.use("/api/pastor", require("./routes/pastor.routes"));

/* ===== VARIABLES DE ENTORNO ===== */
const PORT = process.env.PORT || 4000;      // ✅ Render asigna el puerto
const MONGO_URI = process.env.MONGO_URI;    // ✅ Mongo desde env

/* ===== MONGODB ===== */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error MongoDB:", err.message);
  });
