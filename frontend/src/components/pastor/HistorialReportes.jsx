import { useEffect, useState } from "react";
import api from "../../services/api";
import { exportarExcel, exportarPDF } from "../../utils/exportar";
import supervisorLayout from "../supervisor/SupervisorLayout";

export default function HistorialReportes() {
  const [reportes, setReportes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [sectores, setSectores] = useState([]);

  const [sectorSel, setSectorSel] = useState("");
  const [supervisorSel, setSupervisorSel] = useState("");
  const [semanaSel, setSemanaSel] = useState(null); // 🆕 TOGGLE SEMANA

  /* =========================
     CARGA INICIAL
  ========================= */
  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const [repRes, secRes] = await Promise.all([
      api.get("/reportes"),
      api.get("/sectores")
    ]);

    setReportes(repRes.data || []);
    setFiltrados(repRes.data || []);
    setSectores(secRes.data || []);
  };

  /* =========================
     FILTRO SECTOR → SOLO UI
  ========================= */
  const cambiarSector = value => {
    setSectorSel(value);

    if (!value) {
      setSupervisorSel("");
      return;
    }

    const sec = sectores.find(s => s.sector === Number(value));
    setSupervisorSel(sec ? sec.supervisor : "");
  };

  /* =========================
     FILTRO SUPERVISOR → SOLO UI
  ========================= */
  const cambiarSupervisor = value => {
    setSupervisorSel(value);

    if (!value) {
      setSectorSel("");
      return;
    }

    const sec = sectores.find(s => s.supervisor === value);
    setSectorSel(sec ? sec.sector : "");
  };

  /* =========================
     TOGGLE SEMANA
  ========================= */
  const toggleSemana = semana => {
    setSemanaSel(prev => (prev === semana ? null : semana));
  };

  /* =========================
     APLICAR FILTROS AUTOMÁTICO
  ========================= */
  useEffect(() => {
    let datos = [...reportes];

    if (sectorSel) {
      datos = datos.filter(r => r.sector === Number(sectorSel));
    }

    // solo filtrar supervisor si NO hay sector
    if (supervisorSel && !sectorSel) {
      datos = datos.filter(r => r.supervisor === supervisorSel);
    }

    if (semanaSel) {
      datos = datos.filter(r => r.semana === semanaSel);
    }

    setFiltrados(datos);
  }, [sectorSel, supervisorSel, semanaSel, reportes]);

  /* =========================
     LIMPIAR FILTROS
  ========================= */
  const limpiarFiltros = () => {
    setSectorSel("");
    setSupervisorSel("");
    setSemanaSel(null);
    setFiltrados(reportes);
  };

  /* =========================
     LISTA DE SEMANAS ÚNICAS
  ========================= */
  const semanas = [...new Set(reportes.map(r => r.semana))].sort(
    (a, b) => a - b
  );

  /* =========================
     TOTALES
  ========================= */
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
      <h2>📜 Historial de Reportes</h2>

      {/* ================= FILTROS ================= */}
      <div style={styles.filtros}>
        <select
          value={sectorSel}
          onChange={e => cambiarSector(e.target.value)}
          style={styles.input}
        >
          <option value="">Todos los sectores</option>
          {sectores.map(s => (
            <option key={s._id} value={s.sector}>
              Sector {s.sector}
            </option>
          ))}
        </select>

        <select
          value={supervisorSel}
          onChange={e => cambiarSupervisor(e.target.value)}
          style={styles.input}
        >
          <option value="">Todos los supervisores</option>
          {sectores.map(s => (
            <option key={s._id} value={s.supervisor}>
              {s.supervisor}
            </option>
          ))}
        </select>

        <button style={styles.clear} onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      {/* ================= FILTRO SEMANAS ================= */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15, flexWrap: "wrap" }}>
        {semanas.map(s => (
          <button
            key={s}
            onClick={() => toggleSemana(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              background: semanaSel === s ? "#0B5C9E" : "#E5E7EB",
              color: semanaSel === s ? "#fff" : "#000"
            }}
          >
            Semana {s}
          </button>
        ))}
      </div>

      {/* ================= EXPORTAR ================= */}
      <div style={{ display: "flex", gap: 12, marginBottom: 15 }}>
        <button onClick={() => exportarExcel(filtrados, "Historial_Pastor")}>
          📗 Excel
        </button>

        <button
          onClick={() =>
            exportarPDF(
              [
                "Semana","Sector","Supervisor","Red","Líder",
                "Mar","Jue","Dom",
                "HNO","INV","TOT","REC","Conv","VP","BA","EVG","Ofrenda","Revision Comité"
              ],
              [
                ...filtrados.map(r => [
                  `Semana ${r.semana}`,
                  r.sector,
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
                  "TOTALES","","","","",
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
              "Historial_Pastor"
            )
          }
        >
          📕 PDF
        </button>
      </div>

      {/* ================= TABLA ================= */}
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Sector</th>
              <th>Supervisor</th>
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
            </tr>
          </thead>

          <tbody>
            {filtrados.map(r => (
              <tr key={r._id}>
                <td>Semana {r.semana}</td>
                <td>{r.sector}</td>
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
              </tr>
            ))}

            <tr style={{ fontWeight: "bold", background: "#F3F4F6" }}>
              <td colSpan={5}>TOTALES</td>
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

/* ESTILOS EXISTENTES (SIN CAMBIOS) */
const styles = {
  filtros: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap"
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    minWidth: 180
  },
  button: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer"
  },
  clear: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer"
  },
  table: {
    width: "100%",
    fontSize: 13,
    borderCollapse: "collapse"
  }
};
