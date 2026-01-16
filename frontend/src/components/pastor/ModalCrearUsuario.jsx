import { useState, useEffect } from "react";
import api from "../../services/api";

export default function ModalCrearUsuario({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("SUPERVISOR");
  const [sector, setSector] = useState("");
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    api.get("/sectores").then(res => setSectores(res.data || []));
  }, []);

  const guardar = async () => {
    if (!nombre || !password || !rol) {
      alert("⚠️ Complete todos los campos");
      return;
    }

    try {
      await api.post("/auth/crear-usuario", {
        nombre,
        password,
        rol,
        sector: rol === "SUPERVISOR" ? Number(sector) : null
      });

      alert("✅ Usuario creado correctamente");
      onClose();
    } catch (e) {
      alert("❌ Error creando usuario");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>👤 Crear Usuario</h3>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <select
          value={rol}
          onChange={e => setRol(e.target.value)}
          style={styles.input}
        >
          <option value="SUPERVISOR">Supervisor</option>
          <option value="PASTOR">Pastor</option>
        </select>

        {rol === "SUPERVISOR" && (
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            style={styles.input}
          >
            <option value="">Seleccione Sector</option>
            {sectores.map(s => (
              <option key={s._id} value={s.sector}>
                Sector {s.sector} - {s.supervisor}
              </option>
            ))}
          </select>
        )}

        <div style={{ marginTop: 20 }}>
          <button style={styles.save} onClick={guardar}>💾 Guardar</button>
          <button style={styles.cancel} onClick={onClose}>❌ Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* ESTILOS SOLO DEL MODAL */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    width: 360
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    marginRight: 10
  },
  cancel: {
    background: "#F4C430",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none"
  }
};
