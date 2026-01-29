import { useEffect, useState } from "react";
import api from "../services/api";
import SupervisorLayout from "./supervisor/SupervisorLayout";
import CrearReporteSemana from "./CrearReporteSemana";
import HistorialSupervisorSemana from "./HistorialSupervisorSemana";

export default function ReporteSector({ usuario, onLogout }) {
  const [sectorInfo, setSectorInfo] = useState(null);
  const [vista, setVista] = useState("INICIO"); // INICIO | CREAR | HISTORIAL
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario) return;

    console.log("Prueba de usuario logeado:", usuario);

    setError("");

    api
      .get(`/sectores/${usuario.sector}`, {
        params: {
          tipoSupervisor: usuario.tipoSupervisor
        }
      })
      .then(res => setSectorInfo(res.data))
      .catch(err => {
        console.error("Error cargando sector:", err.response?.data);
        setError("Error cargando sector");
      });
  }, [usuario.sector, usuario.tipoSupervisor]);

  if (!sectorInfo) {
    return (
      <SupervisorLayout onLogout={onLogout} supervisor={usuario}>
        <p>{error || "Cargando información del sector..."}</p>
      </SupervisorLayout>
    );
  }

  return (
    <SupervisorLayout onLogout={onLogout} supervisor={usuario}>
      {/* ===== CARDS SUPERIORES ===== */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Sector</h3>
          <span style={styles.numero}>{sectorInfo.sector}</span>
        </div>

        <div style={styles.card}>
          <h3>Facilitador</h3>
          <span style={styles.texto}>{sectorInfo.supervisor}</span>
          <small style={styles.tipo}>{sectorInfo.tipoSupervisor}</small>
        </div>

        <div style={styles.card}>
          <h3>Redes</h3>
          <span style={styles.numero}>{sectorInfo.redes.length}</span>
        </div>
      </div>

      {/* ===== BOTONES ===== */}
      <div style={styles.botones}>
        <button
          style={vista === "CREAR" ? styles.btnActive : styles.btn}
          onClick={() => setVista("CREAR")}
        >
          ➕ Crear Reporte
        </button>

        <button
          style={vista === "HISTORIAL" ? styles.btnActive : styles.btn}
          onClick={() => setVista("HISTORIAL")}
        >
          📜 Historial
        </button>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div style={styles.contenido}>
        {/* -------- INICIO -------- */}
        {vista === "INICIO" && (
          <>
            <h3>Información del Sector</h3>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Red</th>
                    <th>Líder</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorInfo.redes.map(r => (
                    <tr key={r.numero}>
                      <td>{r.numero}</td>
                      <td>{r.lider}</td>
                      <td>{r.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* -------- CREAR REPORTE -------- */}
        {vista === "CREAR" && (
          <CrearReporteSemana
            usuario={usuario}
            redes={sectorInfo.redes}
            volver={() => setVista("INICIO")}
          />
        )}

        {/* -------- HISTORIAL -------- */}
        {vista === "HISTORIAL" && (
          <>
            <HistorialSupervisorSemana
              sector={usuario.sector}
              tipoSupervisor={usuario.tipoSupervisor}
            />

            <div style={{ marginTop: 25, textAlign: "center" }}>
              <button
                style={styles.btn}
                onClick={() => setVista("INICIO")}
              >
                ⬅ Volver
              </button>
            </div>
          </>
        )}
      </div>
    </SupervisorLayout>
  );
}

/* ===== ESTILOS (NO TOCAR) ===== */

const styles = {
  cards: {
    display: "flex",
    gap: 30,
    justifyContent: "center",
    marginBottom: 30,
    flexWrap: "wrap"
  },
  card: {
    background: "#fff",
    width: 220,
    padding: 20,
    textAlign: "center",
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
  },
  numero: {
    display: "block",
    marginTop: 8,
    fontSize: 36,
    fontWeight: "bold",
    color: "#0B5C9E"
  },
  texto: {
    display: "block",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "bold"
  },
  tipo: {
    fontSize: 12,
    color: "#6B7280"
  },
  botones: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
    flexWrap: "wrap"
  },
  btn: {
    background: "#F4C430",
    border: "none",
    padding: "12px 26px",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  },
  btnActive: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "12px 26px",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  },
  contenido: {
    background: "#fff",
    padding: 25,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 400
  }
};
