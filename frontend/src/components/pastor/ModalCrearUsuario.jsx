import { useState } from "react";
import api from "../../services/api";

export default function ModalCrearUsuario({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("SUPERVISOR");

  const [sector, setSector] = useState("");
  const [tipoSupervisor, setTipoSupervisor] = useState("");

  const guardar = async () => {
    if (!nombre || !password || !rol) {
      alert("⚠️ Complete todos los campos");
      return;
    }

    if (rol === "SUPERVISOR") {
      if (!sector || !tipoSupervisor) {
        alert("⚠️ Ingrese sector y tipo de supervisor");
        return;
      }

      if (isNaN(sector) || Number(sector) <= 0) {
        alert("⚠️ El sector debe ser un número válido");
        return;
      }
    }

    try {
      await api.post("/auth/crear-usuario", {
        nombre,
        password,
        rol,
        sector: rol === "SUPERVISOR" ? Number(sector) : null,
        tipoSupervisor: rol === "SUPERVISOR" ? tipoSupervisor : null
      });

      alert("✅ Usuario creado correctamente");
      onClose();
    } catch (e) {
      console.error(e);

      if (e.response?.data?.message) {
        alert(`❌ ${e.response.data.message}`);
      } else {
        alert("❌ Error creando usuario");
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>👤 Crear Usuario</h3>

        {/* NOMBRE */}
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* ROL */}
        <select
          value={rol}
          onChange={e => {
            setRol(e.target.value);
            setSector("");
            setTipoSupervisor("");
          }}
          style={styles.input}
        >
          <option value="SUPERVISOR">Supervisor</option>
          <option value="PASTOR">Pastor</option>
        </select>

        {/* SOLO PARA SUPERVISOR */}
        {rol === "SUPERVISOR" && (
          <>
            {/* SECTOR MANUAL */}
            <input
              type="number"
              placeholder="Número de Sector (ej: 1)"
              value={sector}
              onChange={e => setSector(e.target.value)}
              style={styles.input}
              min={1}
            />

            {/* TIPO SUPERVISOR */}
            <select
              value={tipoSupervisor}
              onChange={e => setTipoSupervisor(e.target.value)}
              style={styles.input}
            >
              <option value="">Tipo de Supervisor</option>
              <option value="Adulto">Adulto</option>
              <option value="Juvenil">Juvenil</option>
              <option value="Infantil">Infantil</option>
            </select>
          </>
        )}

        {/* BOTONES */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button style={styles.save} onClick={guardar}>
            💾 Guardar
          </button>
          <button style={styles.cancel} onClick={onClose}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */
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
    width: 360,
    boxSizing: "border-box"
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    marginRight: 10,
    cursor: "pointer"
  },
  cancel: {
    background: "#F4C430",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  }
};
