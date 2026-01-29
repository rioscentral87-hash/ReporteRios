import { useState, useEffect } from "react";
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

  /* =========================
      SINCRONIZAR FECHA
  ========================== */
  useEffect(() => {
    if (filas.length > 0) {
      setFilas(prev =>
        prev.map(f => ({
          ...f,
          fecha
        }))
      );
    }
  }, [fecha]);

  /* =========================
      CREAR FILAS
  ========================== */
  const crearReporte = () => {
    if (!fecha) {
      alert("Seleccione una fecha");
      return;
    }

    const nuevasFilas = (Array.isArray(redes) ? redes : []).map(r => ({
      fecha,
      sector: sectorNumero,
      supervisor: supervisorNombre,
      red: r.numero,
      lider: r.lider,
      infoIglesia: {
        martes: "",
        jueves: "",
        domingo: ""
      },
      infoCelula: {
        HNO: "",
        INV: "",
        TOT: "",
        REC: "",
        Conv: "",
        VP: "",
        BA: "",
        EVG: "",
        Ofrenda: ""
      }
    }));

    setFilas(nuevasFilas);
  };

  /* =========================
     LIMPIAR VACÍOS → 0
  ========================== */
  const limpiarNumeros = obj => {
    const limpio = {};
    for (const k in obj) {
      limpio[k] = obj[k] === "" ? 0 : Number(obj[k]);
    }
    return limpio;
  };

  /* =========================
      GUARDAR (VALIDACIÓN REAL)
  ========================== */
  const guardarReporte = async () => {
    try {
      if (filas.length === 0) return;

      const fechaReal = filas[0].fecha;

      const res = await api.get(`/reportes/sector/${sectorNumero}`);

      const existeFecha = res.data.some(
        r => r.fecha === fechaReal
      );

      if (existeFecha) {
        alert(
          `❌ Ya existe un reporte para el sector ${sectorNumero} en la fecha ${fechaReal}`
        );
        return;
      }

      const datosFinales = filas.map(f => ({
        ...f,
        infoIglesia: limpiarNumeros(f.infoIglesia),
        infoCelula: limpiarNumeros(f.infoCelula)
      }));

      await api.post("/reportes", datosFinales);

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
