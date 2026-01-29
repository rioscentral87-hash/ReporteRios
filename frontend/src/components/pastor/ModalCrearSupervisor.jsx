import { useState } from "react";
import api from "../../services/api";

export default function ModalCrearSupervisor({ onClose, onCreado }) {
  const [sector, setSector] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [tipoSupervisor, setTipoSupervisor] = useState("Adulto");
  const [redes, setRedes] = useState([]);

  const agregarRed = () => {
    setRedes([...redes, { numero: "", lider: "", tipo: "Adulto" }]);
  };

  const cambiarRed = (i, campo, valor) => {
    const copia = [...redes];
    copia[i][campo] = valor;
    setRedes(copia);
  };

  const guardar = async () => {
    if (!sector || !supervisor || !tipoSupervisor) {
      alert("⚠️ Complete todos los datos del supervisor");
      return;
    }

    if (isNaN(sector) || Number(sector) <= 0) {
      alert("⚠️ El sector debe ser un número válido");
      return;
    }

    try {
      await api.post("/sectores", {
        sector: Number(sector),
        supervisor,
        tipoSupervisor,
        redes
      });

      alert("✅ Supervisor creado correctamente");
      onCreado();
      onClose();
    } catch (e) {
      console.error(e);

      if (e.response?.data?.message) {
        alert(`❌ ${e.response.data.message}`);
      } else {
        alert("❌ Error creando supervisor");
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>➕ Crear Supervisor</h3>

        {/* SECTOR */}
        <input
          placeholder="Número de sector"
          type="number"
          min={1}
          value={sector}
          onChange={e => setSector(e.target.value)}
          style={styles.input}
        />

        {/* NOMBRE SUPERVISOR */}
        <input
          placeholder="Nombre del supervisor"
          value={supervisor}
          onChange={e => setSupervisor(e.target.value)}
          style={styles.input}
        />

        {/* TIPO SUPERVISOR */}
        <select
          value={tipoSupervisor}
          onChange={e => setTipoSupervisor(e.target.value)}
          style={styles.input}
        >
          <option value="Adulto">Adulto</option>
          <option value="Juvenil">Juvenil</option>
          <option value="Infantil">Infantil</option>
        </select>

        <h4>Redes</h4>

        {redes.map((r, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 8, marginBottom: 6 }}
          >
            <input
              placeholder="Red"
              type="number"
              min={1}
              value={r.numero}
              onChange={e => cambiarRed(i, "numero", e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Líder"
              value={r.lider}
              onChange={e => cambiarRed(i, "lider", e.target.value)}
              style={styles.input}
            />

            <select
              value={r.tipo}
              onChange={e => cambiarRed(i, "tipo", e.target.value)}
              style={styles.input}
            >
              <option value="Adulto">Adulto</option>
              <option value="Juvenil">Juvenil</option>
              <option value="Infantil">Infantil</option>
            </select>
          </div>
        ))}

        <button style={styles.add} onClick={agregarRed}>
          ➕ Agregar red
        </button>

        <div style={{ marginTop: 15 }}>
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

/* 🎨 ESTILOS */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: 25,
    borderRadius: 14,
    width: 420,
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box"
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  add: {
    background: "#E5E7EB",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginBottom: 10
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    marginRight: 10,
    cursor: "pointer"
  },
  cancel: {
    background: "#F4C430",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  }
};
