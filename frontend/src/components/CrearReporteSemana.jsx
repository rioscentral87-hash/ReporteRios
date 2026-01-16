import { useState } from "react";
import api from "../services/api";
import { exportarExcel, exportarPDF } from "../utils/exportar";

export default function CrearReporteSemana({ usuario, redes, volver }) {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [semana, setSemana] = useState("");
  const [filas, setFilas] = useState([]);

  const semanas = Array.from({ length: 52 }, (_, i) => i + 1);

  /* =========================
     ➕ CREAR FILAS
  ========================== */
  const crear = () => {
    if (!semana) {
      alert("Seleccione una semana");
      return;
    }

    setFilas(
      redes.map(r => ({
        anio,
        semana: Number(semana),
        sector: usuario.sector,
        supervisor: usuario.nombre, // ✅ SE GUARDA SUPERVISOR
        red: r.numero,
        lider: r.lider,
        tipoRed: r.tipo || "Adulto", // ✅ NUEVO (por modelo)
        infoIglesia: {
          martes: 0,
          jueves: 0,
          domingo: 0
        },
        infoCelula: {
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
      }))
    );
  };

  /* =========================
     🔄 CAMBIOS + AUTO-TOT
  ========================== */
  const cambiar = (i, grupo, campo, valor) => {
    const copia = [...filas];

    let numero = Number(valor);
    if (isNaN(numero) || numero < 0) numero = 0;

    copia[i][grupo][campo] = numero;

    // 🔹 TOT = HNO + INV
    if (grupo === "infoCelula" && (campo === "HNO" || campo === "INV")) {
      copia[i].infoCelula.TOT =
        copia[i].infoCelula.HNO + copia[i].infoCelula.INV;
    }

    setFilas(copia);
  };

  /* =========================
     💾 GUARDAR (VALIDA DUPLICADO)
  ========================== */
  const guardar = async () => {
    try {
      const res = await api.get(
        `/reportes/sector/${usuario.sector}?anio=${anio}&semana=${semana}`
      );

      if (res.data.length > 0) {
        alert(
          `❌ Ya existe un reporte para el sector ${usuario.sector} en la semana ${semana}`
        );
        return;
      }

      await api.post("/reportes", filas);
      alert("✅ Reporte semanal guardado correctamente");
      volver();
    } catch (error) {
      console.error(error);
      alert("Error guardando reporte");
    }
  };

  /* =========================
     🔢 TOTALES
  ========================== */
  const totales = filas.reduce(
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
      <h3>➕ Crear Reporte Semanal</h3>

      {/* SELECTORES */}
      <div style={{ display: "flex", gap: 10 }}>
        <select value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2025, 2026, 2027].map(a => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select value={semana} onChange={e => setSemana(e.target.value)}>
          <option value="">Semana</option>
          {semanas.map(s => (
            <option key={s} value={s}>
              Semana {s}
            </option>
          ))}
        </select>

        <button onClick={crear}>Crear Reporte</button>
      </div>

      {filas.length > 0 && (
        <>
          {/* EXPORTAR */}
          <div style={{ marginTop: 10 }}>
            <button onClick={() => exportarExcel(filas, "Reporte_Semanal")}>
              📗 Excel
            </button>

            <button
              onClick={() =>
                exportarPDF(
                  [
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
                    "Ofrenda"
                  ],
                  filas.map(r => [
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
                  "Reporte_Semanal"
                )
              }
            >
              📕 PDF
            </button>
          </div>

          {/* TABLA RESPONSIVE */}
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table
              style={{
                width: "100%",
                minWidth: 900,
                tableLayout: "fixed"
              }}
            >
              <thead>
                <tr>
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
                {filas.map((r, i) => (
                  <tr key={i}>
                    <td>{r.red}</td>
                    <td>{r.lider}</td>

                    {["martes", "jueves", "domingo"].map(c => (
                      <td key={c}>
                        <input
                          type="number"
                          min="0"
                          value={r.infoIglesia[c]}
                          style={styles.inputTabla}
                          onChange={e =>
                            cambiar(i, "infoIglesia", c, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    {[
                      "HNO",
                      "INV",
                      "TOT",
                      "REC",
                      "Conv",
                      "VP",
                      "BA",
                      "EVG",
                      "Ofrenda"
                    ].map(c => (
                      <td key={c}>
                        <input
                          type="number"
                          min="0"
                          disabled={c === "TOT"}
                          value={r.infoCelula[c]}
                          style={styles.inputTabla}
                          onChange={e =>
                            cambiar(i, "infoCelula", c, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* TOTALES */}
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={2}>TOTALES</td>
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

          <button onClick={guardar}>💾 Guardar</button>
          <button onClick={volver}>⬅ Volver</button>
        </>
      )}
    </div>
  );
}

/* 🎯 ESTILO INPUT TABLA */
const styles = {
  inputTabla: {
    width: "100%",
    boxSizing: "border-box",
    padding: "4px",
    border: "1px solid #ccc",
    borderRadius: 4,
    textAlign: "center"
  }
};
