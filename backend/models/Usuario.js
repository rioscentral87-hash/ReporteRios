

const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  password: String,
  rol: {
    type: String,
    enum: ["PASTOR", "SUPERVISOR","COMITE"]
  },
  sector: Number,
  tipoSupervisor: {
    type: String,
    enum: ["Adulto", "Juvenil", "Infantil"]
  }
});


module.exports = mongoose.model("Usuario", UsuarioSchema);


