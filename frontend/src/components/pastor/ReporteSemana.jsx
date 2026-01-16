import { useEffect, useState } from "react";
import api from "../../services/api";
import { exportarExcel, exportarPDF } from "../../utils/exportar";

/* 📅 CALCULAR SEMANA ACTUAL */
function obtenerSemanaActual() {
  const hoy = new Date();
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
  const dias = Math.floor((hoy - inicioAnio) / (24 * 60 * 60 * 1000));
  return Math.ceil((dias + inicioAnio.getDay() + 1) / 7);
}

export default function ReporteSemana() {
  const [reportes, setReportes] = useState([]);

  const anioActual = new Date().getFullYear();
  const semanaActual = obtenerSemanaActual();

  useEffect(() => {
    api.get("/reportes").then(r => setReportes(r.data || []));
  }, []);

  /* 🔍 SOLO SEMANA ACTUAL */
  const filtrados = reportes.filter(
    r => r.anio === anioActual && r.semana === semanaActual
  );

  /* 🔢 TOTALES */
  const totales = filtrados.reduce(
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
      martes: 0, jueves: 0, domingo: 0,
      HNO: 0, INV: 0, TOT: 0, REC: 0,
      Conv: 0, VP: 0, BA: 0, EVG: 0, Ofrenda: 0
    }
  );

  return (
    <div>
      <h2>📊 Reporte Semanal – Pastor</h2>

      <p style={{ fontWeight: "bold", marginBottom: 10 }}>
        📅 Semana actual: Semana {semanaActual} – {anioActual}
      </p>

      {/* EXPORTAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button onClick={() => exportarExcel(filtrados, "Reporte_Pastor")}>
          📗 Excel
        </button>

        <button
          onClick={() =>
            exportarPDF(
              [
                "Sector","Facilitador","Red","Líder",
                "Mar","Jue","Dom",
                "HNO","INV","TOT","REC","Conv","VP","BA","EVG","Ofrenda"
              ],
              filtrados.map(r => [
                r.sector,
                r.supervisor || "—",
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
                r.infoCelula.Ofrenda
              ]),
              "Reporte_Pastor"
            )
          }
        >
          📕 PDF
        </button>
      </div>

      {/* 📊 TABLA RESPONSIVE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 1200, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Sector</th>
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
            </tr>
          </thead>

          <tbody>
            {filtrados.map(r => (
              <tr key={r._id}>
                <td>{r.sector}</td>
                <td>{r.supervisor || "—"}</td>
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
              </tr>
            ))}

            {/* TOTALES */}
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
