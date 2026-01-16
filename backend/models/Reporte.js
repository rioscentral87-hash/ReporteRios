const mongoose = require("mongoose");

const ReporteSchema = new mongoose.Schema(
  {
    anio: {
      type: Number,
      required: true
    },
    semana: {
      type: Number,
      required: true
    },
    sector: {
      type: Number,
      required: true
    },
    red: {
      type: Number,
      required: true
    },
    lider: {
      type: String,
      required: true
    },

    infoIglesia: {
      martes: { type: Number, default: 0 },
      jueves: { type: Number, default: 0 },
      domingo: { type: Number, default: 0 }
    },

    infoCelula: {
      HNO: { type: Number, default: 0 },
      INV: { type: Number, default: 0 },
      TOT: { type: Number, default: 0 },
      REC: { type: Number, default: 0 },
      Conv: { type: Number, default: 0 },
      VP: { type: Number, default: 0 },
      BA: { type: Number, default: 0 },
      EVG: { type: Number, default: 0 },
      Ofrenda: { type: Number, default: 0 }
    },
    supervisor: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("Reporte", ReporteSchema);
