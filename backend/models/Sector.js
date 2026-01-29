const mongoose = require("mongoose");

const RedSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: true
    },
    lider: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      enum: ["Adulto", "Juvenil", "Infantil"],
      required: true
    }
  },
  { _id: false }
);

const SectorSchema = new mongoose.Schema(
  {
    supervisor: {
      type: String,
      required: true
    },
    tipoSupervisor: {
      type: String,
      enum: ["Adulto", "Juvenil", "Infantil"],
      required: true
    },
    sector: {
      type: Number,
      required: true
    },
    redes: {
      type: [RedSchema],
      default: []
    }
  },
  { timestamps: true }
);
// Indice Unico para sector + tipoSupervisor
SectorSchema.index(
  { sector: 1, tipoSupervisor: 1 },
  { unique: true }
);

module.exports = mongoose.model("Sector", SectorSchema);
