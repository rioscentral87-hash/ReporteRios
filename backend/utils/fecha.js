function getSemanaActual() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), 0, 1);
  const diff = hoy - inicio;
  return Math.ceil(((diff / 86400000) + inicio.getDay() + 1) / 7);
}

module.exports = { getSemanaActual };
