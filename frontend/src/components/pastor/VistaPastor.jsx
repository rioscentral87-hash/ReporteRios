import { useState } from "react";
import SupervisorLayout from "../supervisor/SupervisorLayout";
import ReporteSemana from "./ReporteSemana";
import DatosGenerales from "./DatosGenerales";
import HistorialReportes from "./HistorialReportes";

export default function VistaPastor({ onLogout }) {
  const [vista, setVista] = useState("DATOS");

  return (
    <SupervisorLayout
      supervisor={{ nombre: "Pastor Orlando Martinez", sector: "Todos" }}
      onLogout={onLogout}
    >
      {/* BOTONES */}
      <div style={styles.tabs}>
        <button
          style={vista === "DATOS" ? styles.active : styles.tab}
          onClick={() => setVista("DATOS")}
        >
          📋 Datos Generales
        </button>

        <button
          style={vista === "SEMANA" ? styles.active : styles.tab}
          onClick={() => setVista("SEMANA")}
        >
          📊 Reporte Semana
        </button>

        <button
          style={vista === "HISTORIAL" ? styles.active : styles.tab}
          onClick={() => setVista("HISTORIAL")}
        >
          📜 Historial
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={styles.content}>
        {vista === "DATOS" && <DatosGenerales />}
        {vista === "SEMANA" && <ReporteSemana />}
        {vista === "HISTORIAL" && <HistorialReportes />} 
        {/* Historial usa la misma vista, solo lectura */}
      </div>
    </SupervisorLayout>
  );
}

const styles = {
  tabs: {
    display: "flex",
    gap: 12,
    marginBottom: 20
  },
  tab: {
    background: "#E5E7EB",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  active: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  content: {
    background: "#fff",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,.1)"
  }
};
