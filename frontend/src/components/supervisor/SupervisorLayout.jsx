import logo from "../../assets/logo.png"; // ajusta la ruta si el logo está en otro lugar

export default function SupervisorLayout({ children, onLogout, supervisor }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.left}>
          <img src={logo} alt="Logo Iglesia" style={styles.logo} />
          <div>
            <div style={styles.church}>Iglesia Central – Ríos de Agua Viva</div>
            <div style={styles.user}>
              {supervisor?.nombre} · Sector {supervisor?.sector}
            </div>
          </div>
        </div>

        <button style={styles.logout} onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <main style={styles.content}>{children}</main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F3F4F6" },
  header: {
    background: "#0B5C9E",
    color: "#fff",
    padding: "14px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,.15)"
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  logo: { height: 42 },
  church: { fontWeight: 700, fontSize: 16 },
  user: { fontSize: 13, opacity: .9 },
  logout: {
    background: "#F4C430",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  content: { padding: 30 }
};

