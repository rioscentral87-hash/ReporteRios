import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import SupervisorLayout from "../supervisor/SupervisorLayout";

export default function ComiteReportes({ usuario, onLogout }) {
  const [vista, setVista] = useState("SEMANA"); // SEMANA | HISTORIAL
  const [semana, setSemana] = useState(null);

  const [reportes, setReportes] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [acciones, setAcciones] = useState({});

  /* ===== FILTROS ===== */
  const [sectorSemanaSel, setSectorSemanaSel] = useState("");
  const [sectorHistSel, setSectorHistSel] = useState("");
  const [semanaHistSel, setSemanaHistSel] = useState(null); // toggle

  useEffect(() => {
    if (vista === "SEMANA") {
      cargarRevisionSemanal();
    } else {
      cargarHistorial();
    }
  }, [vista]);

  /* ============================
     CARGAR REVISIÓN SEMANAL
  ============================ */
  const cargarRevisionSemanal = async () => {
    try {
      const res = await api.get("/reportes/pendientes-comite-semana");
      setSemana(res.data.semana);
      setReportes(res.data.reportes || []);
      setAcciones({});
      setSectorSemanaSel("");
    } catch (e) {
      console.error("Error cargando revisión semanal", e);
    }
  };

  /* ============================
     CARGAR HISTORIAL
  ============================ */
  const cargarHistorial = async () => {
    try {
      const res = await api.get("/reportes/historial-comite");
      setHistorial(res.data || []);
      setSectorHistSel("");
      setSemanaHistSel(null);
    } catch (e) {
      console.error("Error cargando historial comité", e);
    }
  };

  /* ============================
     GUARDAR REVISIÓN
  ============================ */
 const guardarRevision = async () => {
  // 🔍 Solo tomar reportes que sí tengan acción válida
  const revisiones = Object.entries(acciones)
    .filter(([_, estado]) =>
      estado === "CONFIRMADO" || estado === "RECHAZADO"
    )
    .map(([id, estado]) => ({
      id,
      estado
    }));

  // 🚫 Si no hay revisiones seleccionadas
  if (revisiones.length === 0) {
    alert("No hay revisiones realizadas");
    return;
  }

  // 🧪 Debug para ver qué se envía
  console.log("Revisiones a guardar:", revisiones);

  try {
    const res = await api.put("/reportes/revision-comite-bulk", {
      revisiones,
      comiteRevisor: usuario.nombre
    });

    console.log("Respuesta backend:", res.data);

    alert("✅ Revisión guardada correctamente");

    // 🔄 Recargar datos después de guardar
    await cargarRevisionSemanal();

    // 🧹 Limpiar acciones para evitar reenviar datos viejos
    setAcciones({});
  } catch (e) {
    console.error("❌ Error guardando revisión", e);

    // Mostrar mensaje del backend si existe
    const mensaje =
      e.response?.data?.message || "Error al guardar revisión";

    alert(mensaje);
  }
};

  /* ============================
     OPCIONES DE SECTORES
  ============================ */
  const sectoresSemana = useMemo(() => {
    const map = new Map();
    reportes.forEach(r => {
      const key = `${r.sector}-${r.supervisor}`;
      map.set(key, r);
    });
    return Array.from(map.values());
  }, [reportes]);

  const sectoresHistorial = useMemo(() => {
    const map = new Map();
    historial.forEach(r => {
      const key = `${r.sector}-${r.supervisor}`;
      map.set(key, r);
    });
    return Array.from(map.values());
  }, [historial]);

  /* ============================
     FILTRADOS
  ============================ */
  const reportesSemanaFiltrados = reportes.filter(r => {
    if (!sectorSemanaSel) return true;

    const [sector, supervisor] = sectorSemanaSel.split("|");
    return r.sector === Number(sector) && r.supervisor === supervisor;
  });

  const historialFiltrado = historial.filter(r => {
    if (sectorHistSel) {
      const [sector, supervisor] = sectorHistSel.split("|");
      if (r.sector !== Number(sector) || r.supervisor !== supervisor) return false;
    }

    if (semanaHistSel && r.semana !== semanaHistSel) return false;

    return true;
  });

  const semanasHistorial = [...new Set(historial.map(r => r.semana))].sort((a, b) => b - a);

  /* ============================
     HISTORIAL AGRUPADO POR FACILITADOR + SEMANA
  ============================ */
  const historialAgrupado = useMemo(() => {
    const map = new Map();

    historialFiltrado.forEach(r => {
      const key = `${r.semana}-${r.supervisor}`;
      const prev = map.get(key);

      if (prev) {
        prev.ofrenda += r.infoCelula?.Ofrenda || 0;
        // Mantener estado y revisor si no existe
        if (!prev.estadoComite && r.estadoComite) prev.estadoComite = r.estadoComite;
        if (!prev.comiteRevisor && r.comiteRevisor) prev.comiteRevisor = r.comiteRevisor;
      } else {
        map.set(key, {
          _id: key,
          semana: r.semana,
          sector: r.sector,
          supervisor: r.supervisor,
          ofrenda: r.infoCelula?.Ofrenda || 0,
          estadoComite: r.estadoComite,
          comiteRevisor: r.comiteRevisor
        });
      }
    });

    return Array.from(map.values());
  }, [historialFiltrado]);

  const totalOfrendaHistorial = historialAgrupado.reduce((total, r) => total + r.ofrenda, 0);

  /* ============================
     RENDER
  ============================ */
  return (
    <SupervisorLayout supervisor={usuario} onLogout={onLogout}>
      {/* ===== TABS ===== */}
      <div style={styles.tabs}>
        <button
          onClick={() => setVista("SEMANA")}
          style={vista === "SEMANA" ? styles.tabActive : styles.tab}
        >
          Revisión Semanal
        </button>

        <button
          onClick={() => setVista("HISTORIAL")}
          style={vista === "HISTORIAL" ? styles.tabActive : styles.tab}
        >
          Historial
        </button>
      </div>

      {/* ===== SEMANA ===== */}
      {vista === "SEMANA" && (
        <div style={styles.card}>
          <h3>Semana Actual: {semana}</h3>

          <select
            style={styles.input}
            value={sectorSemanaSel}
            onChange={e => setSectorSemanaSel(e.target.value)}
          >
            <option value="">Todos los sectores</option>
            {sectoresSemana.map(r => (
              <option key={`${r.sector}-${r.supervisor}`} value={`${r.sector}|${r.supervisor}`}>
                Sector {r.sector} — {r.supervisor}
              </option>
            ))}
          </select>

          {reportesSemanaFiltrados.length === 0 ? (
            <p>No hay reportes pendientes</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Sector</th>
                      <th>Facilitador</th>
                      <th>Red</th>
                      <th>Líder</th>
                      <th>Ofrenda</th>
                      <th>Revisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportesSemanaFiltrados.map(r => (
                      <tr key={r._id}>
                        <td>{r.sector}</td>
                        <td>{r.supervisor}</td>
                        <td>{r.red}</td>
                        <td>{r.lider}</td>
                        <td>{r.infoCelula?.Ofrenda || 0}</td>
                        <td>
                          <select
                            value={acciones[r._id] || ""}
                            onChange={e =>
                              setAcciones(prev => ({
                                ...prev,
                                [r._id]: e.target.value
                              }))
                            }
                          >
                            <option value="">Seleccione</option>
                            <option value="CONFIRMADO">✔ Confirmar</option>
                            <option value="RECHAZADO">✖ Rechazar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button style={styles.guardar} onClick={guardarRevision}>
                💾 Guardar revisión
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== HISTORIAL ===== */}
      {vista === "HISTORIAL" && (
        <div style={styles.card}>
          <h3>Historial de Revisión</h3>

          {/* FILTROS */}
          <div style={styles.filtros}>
            <select
              style={styles.input}
              value={sectorHistSel}
              onChange={e => setSectorHistSel(e.target.value)}
            >
              <option value="">Todos los sectores</option>
              {sectoresHistorial.map(r => (
                <option key={`${r.sector}-${r.supervisor}`} value={`${r.sector}|${r.supervisor}`}>
                  Sector {r.sector} — {r.supervisor}
                </option>
              ))}
            </select>

            {semanasHistorial.map(s => (
              <button
                key={s}
                onClick={() => setSemanaHistSel(semanaHistSel === s ? null : s)}
                style={semanaHistSel === s ? styles.toggleActive : styles.toggle}
              >
                Semana {s}
              </button>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Sector</th>
                  <th>Facilitador</th>
                  <th>Ofrenda</th>
                  <th>Estado</th>
                  <th>Revisado por</th>
                </tr>
              </thead>
              <tbody>
                {historialAgrupado.map(r => (
                  <tr key={r._id}>
                    <td>{r.semana}</td>
                    <td>{r.sector}</td>
                    <td>{r.supervisor}</td>
                    <td>{r.ofrenda}</td>
                    <td>
                      {r.estadoComite === "CONFIRMADO" && (
                        <span style={{ color: "green" }}>✔ Confirmado</span>
                      )}
                      {r.estadoComite === "RECHAZADO" && (
                        <span style={{ color: "red" }}>✖ Rechazado</span>
                      )}
                    </td>
                    <td>{r.comiteRevisor}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", background: "#F3F4F6" }}>
                  <td colSpan="3">TOTAL OFRENDA</td>
                  <td>{totalOfrendaHistorial}</td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SupervisorLayout>
  );
}

/* ===== ESTILOS ===== */
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  tab: {
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    background: "#E5E7EB",
    cursor: "pointer"
  },
  tabActive: {
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    background: "#0B5C9E",
    color: "#fff",
    fontWeight: "bold"
  },
  guardar: {
    marginTop: 20,
    background: "#16A34A",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: 10,
    fontWeight: "bold",
    cursor: "pointer"
  },
  filtros: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 15
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  toggle: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer"
  },
  toggleActive: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#0B5C9E",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
