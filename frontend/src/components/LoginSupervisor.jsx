import { useState, useEffect } from "react";
import api from "../services/api";
import logo from "../assets/logo.png";

export default function LoginSupervisor({ setUsuario }) {
  const [rol, setRol] = useState("SUPERVISOR");
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (rol === "SUPERVISOR") {
      api.get("/auth/supervisores")
        .then(res => setUsuarios(res.data || []))
        .catch(() => setUsuarios([]));
    }
  }, [rol]);

  const ingresar = async () => {
    setError("");

    if (rol === "SUPERVISOR" && !nombre) {
      setError("Seleccione su nombre");
      return;
    }

    if (!password) {
      setError("Ingrese la contraseña");
      return;
    }

    const payload =
      rol === "PASTOR"
        ? { nombre: "Pastor General", password }
        : { nombre, password };

    try {
      const res = await api.post("/auth/login", payload);
      console.log("USUARIO LOGUEADO:", res.data);
      setUsuario(res.data);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* ===== LOGO ===== */}
        <img
          src={logo}
          alt="Logo Iglesia"
          style={styles.logo}
        />

        {/* ===== NOMBRE IGLESIA ===== */}
        <h3 style={styles.iglesia}>
          Iglesia Central Rios de Agua Viva
        </h3>

        <h2>Ingreso al Sistema</h2>

        {/* Selector de rol */}
        <div style={styles.roleBox}>
          <button
            style={rol === "SUPERVISOR" ? styles.roleActive : styles.role}
            onClick={() => {
              setRol("SUPERVISOR");
              setNombre("");
            }}
          >
            Facilitador
          </button>

          <button
            style={rol === "PASTOR" ? styles.roleActive : styles.role}
            onClick={() => {
              setRol("PASTOR");
              setNombre("");
            }}
          >
            Pastor
          </button>
        </div>

        {/* Supervisor */}
        {rol === "SUPERVISOR" && (
          <select
            style={styles.input}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          >
            <option value="">Seleccione su nombre</option>
            {usuarios.map((u, i) => (
              <option key={i} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Contraseña */}
        <input
          type="password"
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={ingresar}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

/* ===== ESTILOS (SOLO SE AGREGAN LOS NUEVOS) ===== */

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
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  },

  /* 🔹 NUEVOS */
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
    border: "1px solid #ccc"
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

