import { useState } from "react";
import api from "../../services/api";

export default function ModalCrearSupervisor({ onClose, onCreado }) {
  const [sector, setSector] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [tipoSupervisor, setTipoSupervisor] = useState("Adulto");
  const [password, setPassword] = useState("");
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
    if (!sector || !supervisor || !password) {
      alert("Complete todos los datos");
      return;
    }

    try {
      await api.post("/sectores", {
        sector: Number(sector),
        supervisor,
        tipoSupervisor,
        redes,
        password
      });
      console.log("estamos en el try de crear supervisor");
      alert("✅ Supervisor creado correctamente");
      onCreado();
      onClose();
    } catch (e) {
      console.log(e);
      alert("❌ Error creando supervisor");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>➕ Crear Supervisor</h3>

        <input
          placeholder="Número de sector"
          type="number"
          value={sector}
          onChange={e => setSector(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Nombre del supervisor"
          value={supervisor}
          onChange={e => setSupervisor(e.target.value)}
          style={styles.input}
        />

        <select
          value={tipoSupervisor}
          onChange={e => setTipoSupervisor(e.target.value)}
          style={styles.input}
        >
          <option>Adulto</option>
          <option>Juvenil</option>
          <option>Infantil</option>
        </select>

        <input
          placeholder="Contraseña del supervisor"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <h4>Redes</h4>

        {redes.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input
              placeholder="Red"
              type="number"
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
              <option>Adulto</option>
              <option>Juvenil</option>
              <option>Infantil</option>
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

/* 🎨 estilos simples de modal */
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
    overflowY: "auto"
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  add: {
    background: "#E5E7EB",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    marginRight: 10
  },
  cancel: {
    background: "#F4C430",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none"
  }
};
