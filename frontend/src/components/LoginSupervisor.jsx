import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function LoginSupervisor({ setUsuario }) {
  const navigate = useNavigate();

  const [rol, setRol] = useState("SUPERVISOR");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  /* ===== CARGAR SUPERVISORES ===== */
  useEffect(() => {
    if (rol === "SUPERVISOR") {
      api
        .get("/auth/supervisores")
        .then(res => setUsuarios(res.data || []))
        .catch(() => setUsuarios([]));
    }
  }, [rol]);

  /* ===== LOGIN ===== */
  const ingresar = async () => {
    setError("");

    if (rol === "SUPERVISOR" && !usuarioSel) {
      setError("Seleccione su nombre");
      return;
    }

    if (!password) {
      setError("Ingrese la contraseña");
      return;
    }

    let payload;

    if (rol === "PASTOR") {
      payload = { rol: "PASTOR", password };
    } else if (rol === "COMITE") {
      payload = { rol: "COMITE", password };
    } else {
      payload = {
        rol: "SUPERVISOR",
        nombre: usuarioSel.nombre,
        sector: Number(usuarioSel.sector),
        tipoSupervisor: usuarioSel.tipoSupervisor,
        password
      };
    }

    try {
      const res = await api.post("/auth/login", payload);
      const usuario = res.data;

      setUsuario(usuario);

      if (usuario.rol === "PASTOR") navigate("/pastor");
      else if (usuario.rol === "COMITE") navigate("/comite");
      else navigate("/supervisor");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Logo Iglesia" style={styles.logo} />

        <h3 style={styles.iglesia}>
          Iglesia Central Ríos de Agua Viva
        </h3>

        <h2>Ingreso al Sistema</h2>

        {/* ROLES */}
        <div style={styles.roleBox}>
          {["SUPERVISOR", "PASTOR", "COMITE"].map(r => (
            <button
              key={r}
              style={rol === r ? styles.roleActive : styles.role}
              onClick={() => {
                setRol(r);
                setUsuarioSel(null);
                setPassword("");
              }}
            >
              {r === "SUPERVISOR"
                ? "Facilitador"
                : r === "PASTOR"
                ? "Pastor"
                : "Comité"}
            </button>
          ))}
        </div>

        {/* SELECT SUPERVISOR */}
        {rol === "SUPERVISOR" && (
          <select
            style={styles.input}
            value={usuarioSel ? usuarioSel._id : ""}
            onChange={e => {
              const seleccionado = usuarios.find(
                u => u._id === e.target.value
              );
              setUsuarioSel(seleccionado || null);
            }}
          >
            <option value="">Seleccione su nombre</option>
            {usuarios.map(u => (
              <option key={u._id} value={u._id}>
                {u.nombre}
              </option>
            ))}
          </select>
        )}

        {/* PASSWORD */}
        <div style={styles.passwordWrapper}>
          <input
            type={mostrarPassword ? "text" : "password"}
            style={styles.passwordInput}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setMostrarPassword(p => !p)}
            style={styles.eyeButton}
            aria-label="Mostrar u ocultar contraseña"
          >
            {/* ICONO SVG BLANCO Y NEGRO */}
            {mostrarPassword ? (
              /* OJO CERRADO */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.21-3.05 3.46-5.5 6.21-6.71" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              /* OJO ABIERTO */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={ingresar}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0B5C9E"
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 10,
    width: 360,
    boxSizing: "border-box", //  evita overflow
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },
  logo: {
    width: 120,
    marginBottom: 10
  },
  iglesia: {
    marginBottom: 15,
    color: "#0B5C9E",
    fontWeight: "bold"
  },
  roleBox: {
    display: "flex",
    gap: 4,
    marginBottom: 15
  },
  role: {
    flex: 1,
    padding: 10,
    border: "1px solid #ccc",
    background: "#eee",
    cursor: "pointer"
  },
  roleActive: {
    flex: 1,
    padding: 10,
    border: "1px solid #0B5C9E",
    background: "#0B5C9E",
    color: "#fff",
    cursor: "pointer"
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },

  /* PASSWORD */
  passwordWrapper: {
    position: "relative",
    marginTop: 10
  },
  passwordInput: {
    width: "100%",
    padding: "12px 44px 12px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: "30%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },

  button: {
    width: "100%",
    marginTop: 15,
    padding: 12,
    border: "none",
    borderRadius: 6,
    background: "#F4C430",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 14
  }
};
