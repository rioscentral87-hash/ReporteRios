module.exports = function (rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};
