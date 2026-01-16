import { useEffect, useState } from "react";
import api from "../../services/api";

export default function HistorialSupervisor({ sectorNumero, onVolver }) {
  const [fecha, setFecha] = useState("");
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const buscar = async () => {
    setCargando(true);
    try {
      const res = await api.get(
        fecha
          ? `/reportes/sector/${sectorNumero}?fecha=${fecha}`
          : `/reportes/sector/${sectorNumero}`
      );
      setReportes(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Error cargando historial");
    }
    setCargando(false);
  };

  useEffect(() => {
    buscar();
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2>Historial de Reportes – Sector {sectorNumero}</h2>
        <button style={styles.volver} onClick={onVolver}>← Volver</button>
      </div>

      <div style={styles.filters}>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
        <button style={styles.primary} onClick={buscar}>
          Buscar
        </button>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : reportes.length === 0 ? (
        <p>No hay reportes</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
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
              {reportes.map((r, i) => (
                <tr key={i}>
                  <td>{r.fecha}</td>
                  <td>{r.red}</td>
                  <td>{r.lider}</td>
                  <td>{r.infoIglesia?.martes ?? 0}</td>
                  <td>{r.infoIglesia?.jueves ?? 0}</td>
                  <td>{r.infoIglesia?.domingo ?? 0}</td>
                  <td>{r.infoCelula?.HNO ?? 0}</td>
                  <td>{r.infoCelula?.INV ?? 0}</td>
                  <td>{r.infoCelula?.TOT ?? 0}</td>
                  <td>{r.infoCelula?.REC ?? 0}</td>
                  <td>{r.infoCelula?.Conv ?? 0}</td>
                  <td>{r.infoCelula?.VP ?? 0}</td>
                  <td>{r.infoCelula?.BA ?? 0}</td>
                  <td>{r.infoCelula?.EVG ?? 0}</td>
                  <td>{r.infoCelula?.Ofrenda ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  filters: {
    display: "flex",
    gap: 12,
    marginBottom: 20
  },
  primary: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};
