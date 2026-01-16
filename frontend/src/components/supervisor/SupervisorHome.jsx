export default function SupervisorHome({
  sectorNumero,
  supervisorNombre,
  redes,
  onCrear,
  onHistorial
}) {
  return (
    <div>
      {/* KPI CARDS */}
      <div style={styles.cards}>
        <div style={styles.cardInfo}>
          <div style={styles.kpiTitle}>Sector</div>
          <div style={styles.kpiValue}>{sectorNumero}</div>
        </div>

        <div style={styles.cardInfo}>
          <div style={styles.kpiTitle}>Facilitador</div>
          <div style={styles.kpiValueSmall}>{supervisorNombre}</div>
        </div>

        <div style={styles.cardInfo}>
          <div style={styles.kpiTitle}>Redes</div>
          <div style={styles.kpiValue}>{(redes || []).length}</div>
        </div>
      </div>

      {/* ACCIONES */}
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onCrear}>
          ➕ Crear Reporte
        </button>

        <button style={styles.secondary} onClick={onHistorial}>
          📜 Historial
        </button>
      </div>

      {/* TABLA REDES */}
      <div style={styles.tableCard}>
        <h3>Redes del Sector</h3>

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
              {(Array.isArray(redes) ? redes : []).map((r, i) => (
                <tr key={i}>
                  <td>{r.numero}</td>
                  <td>{r.lider}</td>
                  <td>{r.tipo || "Adulto"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 16
  },
  cardInfo: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,.1)"
  },
  kpiTitle: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 4
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0B5C9E"
  },
  kpiValueSmall: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0B5C9E"
  },
  actions: {
    display: "flex",
    gap: 16,
    margin: "24px 0",
    flexWrap: "wrap"
  },
  primary: {
    background: "#0B5C9E",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: 12,
    fontWeight: "bold",
    cursor: "pointer"
  },
  secondary: {
    background: "#F4C430",
    border: "none",
    padding: "14px 24px",
    borderRadius: 12,
    fontWeight: "bold",
    cursor: "pointer"
  },
  tableCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 10px 25px rgba(0,0,0,.1)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 400
  }
};
