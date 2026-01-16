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
    sector: {
      type: Number,
      required: true,
      unique: true
    },
    supervisor: {
      type: String,
      required: true
    },
    tipoSupervisor: {
      type: String,
      enum: ["Adulto", "Juvenil", "Infantil"],
      required: true
    },
    redes: {
      type: [RedSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sector", SectorSchema);
