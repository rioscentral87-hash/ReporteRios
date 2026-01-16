import { useState } from "react";
import TablaRedes from "../TablaRedes";
import api from "../../services/api";

export default function CrearReporte({
  sectorNumero,
  supervisorNombre,
  redes,
  onVolver
}) {
  const [fecha, setFecha] = useState("");
  const [filas, setFilas] = useState([]);

  const crearReporte = () => {
    if (!fecha) {
      alert("Seleccione una fecha");
      return;
    }

    const nuevasFilas = (Array.isArray(redes) ? redes : []).map(r => ({
        fecha,
        sector: sectorNumero,
        supervisor: supervisorNombre, // ✅ AQUÍ ESTÁ LA CLAVE
        red: r.numero,
        lider: r.lider,
        infoIglesia: {
            martes: 0,
            jueves: 0,
            domingo: 0
        },
        infoCelula: {
            HNO: 0,
            INV: 0,
            TOT: 0,
            REC: 0,
            Conv: 0,
            VP: 0,
            BA: 0,
            EVG: 0,
            Ofrenda: 0
        }
        }));


    setFilas(nuevasFilas);
  };

  const guardarReporte = async () => {
    try {
      await api.post("/reportes", filas);
      alert("Reporte guardado correctamente");
      setFecha("");
      setFilas([]);
      onVolver();
    } catch (err) {
      console.error(err);
      alert("Error al guardar reporte");
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2>Crear Reporte – Sector {sectorNumero}</h2>
        <button style={styles.volver} onClick={onVolver}>
          ← Volver
        </button>
      </div>

      <div style={styles.row}>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
      </div>

      <button style={styles.primary} onClick={crearReporte}>
        Crear Reporte
      </button>

      {filas.length > 0 && (
        <>
          <TablaRedes filas={filas} setFilas={setFilas} />

          <button style={styles.save} onClick={guardarReporte}>
            Guardar Reporte
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,.1)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  volver: {
    background: "#E5E7EB",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 15
  },
  primary: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: 20
  },
  save: {
    background: "#F4C430",
    border: "none",
    padding: "14px 26px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 20
  }
};
