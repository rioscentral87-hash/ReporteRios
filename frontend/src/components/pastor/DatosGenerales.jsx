import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalCrearSupervisor from "./ModalCrearSupervisor";
import ModalCrearUsuario from "./ModalCrearUsuario";

export default function DatosGenerales() {
  const [sectores, setSectores] = useState([]);
  const [editando, setEditando] = useState(false);
  const [backup, setBackup] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await api.get("/sectores");
    setSectores(res.data || []);
    setBackup(JSON.parse(JSON.stringify(res.data || [])));
  };

  /* ===== CAMBIOS DE VALORES ===== */
  const cambiarSectorValor = (s, campo, valor) => {
    const copia = [...sectores];
    copia[s][campo] = valor;
    setSectores(copia);
  };

  const cambiarRedValor = (s, r, campo, valor) => {
    const copia = [...sectores];
    copia[s].redes[r][campo] = valor;
    setSectores(copia);
  };

  /* ===== REDES ===== */
  const agregarRed = sIndex => {
    const copia = [...sectores];
    copia[sIndex].redes.push({
      numero: "",
      lider: "",
      tipo: "Adulto"
    });
    setSectores(copia);
  };

  const eliminarRed = (sIndex, rIndex) => {
    if (!window.confirm("¿Eliminar esta red?")) return;
    const copia = [...sectores];
    copia[sIndex].redes.splice(rIndex, 1);
    setSectores(copia);
  };

  /* ===== GUARDAR / CANCELAR ===== */
  const guardar = async () => {
    try {
      for (const s of sectores) {
        if (!s.sector || !s.supervisor) {
          alert("⚠️ Sector y Supervisor son obligatorios");
          return;
        }

        await api.put(`/sectores/${s._id}`, s);
      }

      setEditando(false);
      cargar();
      alert("✅ Datos guardados correctamente");
    } catch (e) {
      alert("❌ Error guardando datos");
    }
  };

  const cancelar = () => {
    setSectores(JSON.parse(JSON.stringify(backup)));
    setEditando(false);
  };

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <h2>📋 Datos Generales</h2>

        <div style={{ display: "flex", gap: 10 }}>
          {/* ➕ AGREGAR SUPERVISOR */}
          <button
            style={styles.addSector}
            onClick={() => setMostrarModal(true)}
          >
            ➕ Agregar Facilitador
          </button>

          {/* 👤 AGREGAR USUARIO (NUEVO) */}
          <button
            style={styles.addSector}
            onClick={() => setMostrarModalUsuario(true)}
          >
            👤 Añadir Usuario
          </button>
        </div>
      </div>

      {/* ===== LISTADO DE SECTORES ===== */}
      {sectores.map((s, sIndex) => (
        <div key={s._id} style={styles.card}>
          {/* ===== DATOS SUPERVISOR ===== */}
          <div style={styles.supervisorBox}>
            <div>
              <strong>Sector:</strong>{" "}
              {editando ? (
                <input
                  type="number"
                  value={s.sector}
                  style={styles.input}
                  onChange={e =>
                    cambiarSectorValor(sIndex, "sector", Number(e.target.value))
                  }
                />
              ) : (
                s.sector
              )}
            </div>

            <div>
              <strong>Facilitador:</strong>{" "}
              {editando ? (
                <input
                  value={s.supervisor}
                  style={styles.input}
                  onChange={e =>
                    cambiarSectorValor(sIndex, "supervisor", e.target.value)
                  }
                />
              ) : (
                s.supervisor
              )}
            </div>

            <div>
              <strong>Tipo:</strong>{" "}
              {editando ? (
                <select
                  value={s.tipoSupervisor}
                  style={styles.input}
                  onChange={e =>
                    cambiarSectorValor(
                      sIndex,
                      "tipoSupervisor",
                      e.target.value
                    )
                  }
                >
                  <option value="Adulto">Adulto</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Infantil">Infantil</option>
                </select>
              ) : (
                s.tipoSupervisor
              )}
            </div>
          </div>

          {/* ===== TABLA REDES ===== */}
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Red</th>
                  <th>Líder</th>
                  <th>Tipo</th>
                  {editando && <th></th>}
                </tr>
              </thead>
              <tbody>
                {s.redes.map((r, rIndex) => (
                  <tr key={rIndex}>
                    <td>
                      {editando ? (
                        <input
                          type="number"
                          value={r.numero}
                          style={styles.input}
                          onChange={e =>
                            cambiarRedValor(
                              sIndex,
                              rIndex,
                              "numero",
                              Number(e.target.value)
                            )
                          }
                        />
                      ) : (
                        r.numero
                      )}
                    </td>

                    <td>
                      {editando ? (
                        <input
                          value={r.lider}
                          style={styles.input}
                          onChange={e =>
                            cambiarRedValor(
                              sIndex,
                              rIndex,
                              "lider",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        r.lider
                      )}
                    </td>

                    <td>
                      {editando ? (
                        <select
                          value={r.tipo}
                          style={styles.input}
                          onChange={e =>
                            cambiarRedValor(
                              sIndex,
                              rIndex,
                              "tipo",
                              e.target.value
                            )
                          }
                        >
                          <option value="Adulto">Adulto</option>
                          <option value="Juvenil">Juvenil</option>
                          <option value="Infantil">Infantil</option>
                        </select>
                      ) : (
                        r.tipo
                      )}
                    </td>

                    {editando && (
                      <td>
                        <button
                          onClick={() => eliminarRed(sIndex, rIndex)}
                          style={styles.delete}
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editando && (
            <button style={styles.addRed} onClick={() => agregarRed(sIndex)}>
              ➕ Agregar Red
            </button>
          )}
        </div>
      ))}

      {/* ===== BOTONES EDICIÓN ===== */}
      {!editando ? (
        <button style={styles.edit} onClick={() => setEditando(true)}>
          ✏️ Editar
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          <button style={styles.save} onClick={guardar}>
            💾 Guardar
          </button>
          <button style={styles.cancel} onClick={cancelar}>
            ❌ Cancelar
          </button>
        </div>
      )}

      {/* ===== MODAL CREAR SUPERVISOR ===== */}
      {mostrarModal && (
        <ModalCrearSupervisor
          onClose={() => setMostrarModal(false)}
          onCreado={cargar}
        />
      )}

      {/* ===== MODAL CREAR USUARIO (NUEVO) ===== */}
      {mostrarModalUsuario && (
        <ModalCrearUsuario
          onClose={() => setMostrarModalUsuario(false)}
        />
      )}
    </div>
  );
}

/* 🎨 ESTILOS (NO CAMBIADOS) */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  supervisorBox: {
    display: "flex",
    gap: 20,
    marginBottom: 10,
    flexWrap: "wrap"
  },
  card: {
    background: "#F9FAFB",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25
  },
  table: {
    width: "100%",
    minWidth: 500,
    borderCollapse: "collapse",
    marginTop: 10,
    tableLayout: "fixed"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  edit: {
    background: "#0B5C9E",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 10,
    border: "none",
    marginRight: 10,
    cursor: "pointer"
  },
  cancel: {
    background: "#F4C430",
    padding: "12px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  },
  addRed: {
    marginTop: 10,
    background: "#E5E7EB",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  addSector: {
    background: "#0B5C9E",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },
  delete: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16
  }
};
