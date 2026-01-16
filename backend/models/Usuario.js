/*const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  password: String, // luego se puede encriptar
  rol: {
    type: String,
    enum: ["SUPERVISOR", "PASTOR"]
  },
  sector: Number // solo para supervisor
});

module.exports = mongoose.model("Usuario", UsuarioSchema);*/

/*const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["PASTOR", "SUPERVISOR"], required: true },
  sector: { type: Number }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);*/

//const mongoose = require("mongoose");

/*const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["PASTOR", "SUPERVISOR"],
    required: true
  },
  sector: {
    type: Number
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
*/

const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, required: true },
  sector: { type: Number }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);


