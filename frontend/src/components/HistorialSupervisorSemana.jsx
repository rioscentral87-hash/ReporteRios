import { useEffect, useState } from "react";
import api from "../services/api";
import { exportarExcel, exportarPDF } from "../utils/exportar";

export default function HistorialSupervisorSemana({ sector }) {
  const [reportes, setReportes] = useState([]);
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);

  useEffect(() => {
    api
      .get(`/reportes/sector/${sector}`)
      .then(res => setReportes(res.data || []));
  }, [sector]);

  /*  SEMANA ACTUAL */
  const hoy = new Date();
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
  const dias = Math.floor((hoy - inicioAnio) / (1000 * 60 * 60 * 24));
  const semanaActual = Math.ceil((dias + inicioAnio.getDay() + 1) / 7);

  /*  SEMANAS DISPONIBLES */
  const semanasDisponibles = [
    ...new Set(reportes.map(r => r.semana))
  ].sort((a, b) => a - b);

  /* ➕ / ➖ TOGGLE SEMANA */
  const toggleSemana = semana => {
    setSemanasSeleccionadas(prev =>
      prev.includes(semana)
        ? prev.filter(s => s !== semana)
        : [...prev, semana]
    );
  };

  const limpiarFiltros = () => {
    setSemanasSeleccionadas([]);
  };

  /*  FILTRADO */
  const reportesFiltrados =
    semanasSeleccionadas.length === 0
      ? reportes
      : reportes.filter(r => semanasSeleccionadas.includes(r.semana));

  /*  ELIMINAR REPORTE */
  const eliminarReporte = async id => {
    if (!window.confirm("¿Seguro que deseas eliminar este reporte?")) return;

    try {
      await api.delete(`/reportes/${id}`);

      setReportes(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error(error);
      alert("❌ Error eliminando reporte");
    }
  };

  /*  TOTALES */
  const totales = reportesFiltrados.reduce(
    (t, r) => {
      t.martes += r.infoIglesia.martes;
      t.jueves += r.infoIglesia.jueves;
      t.domingo += r.infoIglesia.domingo;

      t.HNO += r.infoCelula.HNO;
      t.INV += r.infoCelula.INV;
      t.TOT += r.infoCelula.TOT;
      t.REC += r.infoCelula.REC;
      t.Conv += r.infoCelula.Conv;
      t.VP += r.infoCelula.VP;
      t.BA += r.infoCelula.BA;
      t.EVG += r.infoCelula.EVG;
      t.Ofrenda += r.infoCelula.Ofrenda;
      return t;
    },
    {
      martes: 0,
      jueves: 0,
      domingo: 0,
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
  );

  return (
    <div>
      <h3>📜 Historial de Reportes</h3>

      {/* 🔍 FILTRO POR SEMANAS */}
      <div style={styles.filtroBox}>
        <strong>Filtrar por semana:</strong>

        <div style={styles.semanas}>
          {semanasDisponibles.map(s => (
            <button
              key={s}
              onClick={() => toggleSemana(s)}
              style={
                semanasSeleccionadas.includes(s)
                  ? styles.semanaActiva
                  : styles.semana
              }
            >
              Semana {s}
            </button>
          ))}
        </div>

        {semanasSeleccionadas.length > 0 && (
          <button onClick={limpiarFiltros} style={styles.limpiar}>
            ❌ Limpiar filtros
          </button>
        )}
      </div>

      {/* 📤 EXPORTAR */}
      <div style={styles.exportar}>
        <button
          onClick={() =>
            exportarExcel(reportesFiltrados, "Historial_Supervisor")
          }
          style={styles.excel}
        >
          📗 Excel
        </button>

        <button
          onClick={() =>
            exportarPDF(
              [
                "Semana",
                "Facilitador",
                "Red",
                "Líder",
                "Mar",
                "Jue",
                "Dom",
                "HNO",
                "INV",
                "TOT",
                "REC",
                "Conv",
                "VP",
                "BA",
                "EVG",
                "Ofrenda",
                "Revisión Comité"
              ],
              [
                ...reportesFiltrados.map(r => [
                  `Semana ${r.semana}`,
                  r.supervisor,
                  r.red,
                  r.lider,
                  r.infoIglesia.martes,
                  r.infoIglesia.jueves,
                  r.infoIglesia.domingo,
                  r.infoCelula.HNO,
                  r.infoCelula.INV,
                  r.infoCelula.TOT,
                  r.infoCelula.REC,
                  r.infoCelula.Conv,
                  r.infoCelula.VP,
                  r.infoCelula.BA,
                  r.infoCelula.EVG,
                  r.infoCelula.Ofrenda,
                  r.estadoComite
                ]),
                [
                  "TOTALES",
                  "",
                  "",
                  "",
                  totales.martes,
                  totales.jueves,
                  totales.domingo,
                  totales.HNO,
                  totales.INV,
                  totales.TOT,
                  totales.REC,
                  totales.Conv,
                  totales.VP,
                  totales.BA,
                  totales.EVG,
                  totales.Ofrenda
                ]
              ],
              "Historial_Supervisor"
            )
          }
          style={styles.pdf}
        >
          📕 PDF
        </button>
      </div>

      {/* 📊 TABLA */}
      <div style={styles.tablaWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Facilitador</th>
              <th>Red</th>
              <th>Líder</th>
              <th>Mar</th>
              <th>Jue</th>
              <th>Dom</th>
              <th>HNO</th>
              <th>INV</th>
              <th>TOT</th>
              <th>REC</th>
              <th>Conv</th>
              <th>VP</th>
              <th>BA</th>
              <th>EVG</th>
              <th>Ofrenda</th>
              <th>Revisión Comité</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {reportesFiltrados.map(r => (
              <tr key={r._id}>
                <td>Semana {r.semana}</td>
                <td>{r.supervisor}</td>
                <td>{r.red}</td>
                <td>{r.lider}</td>
                <td>{r.infoIglesia.martes}</td>
                <td>{r.infoIglesia.jueves}</td>
                <td>{r.infoIglesia.domingo}</td>
                <td>{r.infoCelula.HNO}</td>
                <td>{r.infoCelula.INV}</td>
                <td>{r.infoCelula.TOT}</td>
                <td>{r.infoCelula.REC}</td>
                <td>{r.infoCelula.Conv}</td>
                <td>{r.infoCelula.VP}</td>
                <td>{r.infoCelula.BA}</td>
                <td>{r.infoCelula.EVG}</td>
                <td>{r.infoCelula.Ofrenda}</td>
                <td>
                  {r.estadoComite === "CONFIRMADO" && (
                    <span style={{ color: "green" }}>
                      ✔ Confirmado
                    </span>
                  )}

                  {r.estadoComite === "RECHAZADO" && (
                    <span style={{ color: "red" }}>
                      ✖ Rechazado
                    </span>
                  )}

                  {r.estadoComite === "PENDIENTE" && (
                    <span style={{ color: "#6b7280" }}>
                      ⏳ Pendiente
                    </span>
                  )}
                </td>

                {/*  SOLO SEMANA ACTUAL */}
                <td>
                  {r.semana === semanaActual-1 && (
                    <button
                      onClick={() => eliminarReporte(r._id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}

            <tr style={{ fontWeight: "bold", background: "#F3F4F6" }}>
              <td colSpan={4}>TOTALES</td>
              <td>{totales.martes}</td>
              <td>{totales.jueves}</td>
              <td>{totales.domingo}</td>
              <td>{totales.HNO}</td>
              <td>{totales.INV}</td>
              <td>{totales.TOT}</td>
              <td>{totales.REC}</td>
              <td>{totales.Conv}</td>
              <td>{totales.VP}</td>
              <td>{totales.BA}</td>
              <td>{totales.EVG}</td>
              <td>{totales.Ofrenda}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*  ESTILOS (SIN CAMBIOS) */
const styles = {
  filtroBox: {
    marginBottom: 15
  },
  semanas: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 8
  },
  semana: {
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #ccc",
    background: "#F3F4F6",
    cursor: "pointer"
  },
  semanaActiva: {
    padding: "6px 12px",
    borderRadius: 20,
    border: "none",
    background: "#0B5C9E",
    color: "#fff",
    cursor: "pointer"
  },
  limpiar: {
    marginTop: 5,
    background: "transparent",
    border: "none",
    color: "#DC2626",
    cursor: "pointer",
    fontWeight: "bold"
  },
  exportar: {
    display: "flex",
    gap: 12,
    marginBottom: 15
  },
  excel: {
    background: "#16A34A",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  pdf: {
    background: "#DC2626",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  tablaWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    minWidth: 1200,
    borderCollapse: "collapse"
  }
};
