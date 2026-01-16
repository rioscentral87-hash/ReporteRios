import { useState } from "react";
import api from "../services/api";
import { exportarExcel, exportarPDF } from "../utils/exportar";

export default function CrearReporteSemana({ usuario, redes, volver }) {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [semana, setSemana] = useState("");
  const [filas, setFilas] = useState([]);

  const semanas = Array.from({ length: 52 }, (_, i) => i + 1);

  /* =========================
     ➕ CREAR FILAS (VACÍAS)
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
        supervisor: usuario.nombre,
        red: r.numero,
        lider: r.lider,
        tipoRed: r.tipo || "Adulto",
        infoIglesia: {
          martes: "",
          jueves: "",
          domingo: ""
        },
        infoCelula: {
          HNO: "",
          INV: "",
          TOT: "",
          REC: "",
          Conv: "",
          VP: "",
          BA: "",
          EVG: "",
          Ofrenda: ""
        }
      }))
    );
  };

  /* =========================
     🔄 CAMBIOS + AUTO-TOT
  ========================== */
  const cambiar = (i, grupo, campo, valor) => {
    const copia = [...filas];

    if (valor === "") {
      copia[i][grupo][campo] = "";
    } else {
      let numero = Number(valor);
      if (isNaN(numero) || numero < 0) numero = 0;
      copia[i][grupo][campo] = numero;
    }

    if (grupo === "infoCelula" && (campo === "HNO" || campo === "INV")) {
      const hno = Number(copia[i].infoCelula.HNO || 0);
      const inv = Number(copia[i].infoCelula.INV || 0);
      copia[i].infoCelula.TOT = hno + inv;
    }

    setFilas(copia);
  };

  /* =========================
     🔁 LIMPIAR VACÍOS → 0
  ========================== */
  const limpiarNumeros = obj => {
    const limpio = {};
    for (const k in obj) {
      limpio[k] = obj[k] === "" ? 0 : Number(obj[k]);
    }
    return limpio;
  };

  /* =========================
     💾 GUARDAR (VALIDACIÓN REAL)
  ========================== */
  const guardar = async () => {
    try {
      const res = await api.get(`/reportes/sector/${usuario.sector}`);

      // ✅ VALIDACIÓN CORRECTA
      const existeSemana = res.data.some(
        r => r.anio === anio && r.semana === Number(semana)
      );

      if (existeSemana) {
        alert(
          `❌ Ya existe un reporte para el sector ${usuario.sector} en la semana ${semana}`
        );
        return;
      }

      const datosFinales = filas.map(f => ({
        ...f,
        infoIglesia: limpiarNumeros(f.infoIglesia),
        infoCelula: limpiarNumeros(f.infoCelula)
      }));

      await api.post("/reportes", datosFinales);
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
      t.martes += Number(r.infoIglesia.martes || 0);
      t.jueves += Number(r.infoIglesia.jueves || 0);
      t.domingo += Number(r.infoIglesia.domingo || 0);

      t.HNO += Number(r.infoCelula.HNO || 0);
      t.INV += Number(r.infoCelula.INV || 0);
      t.TOT += Number(r.infoCelula.TOT || 0);
      t.REC += Number(r.infoCelula.REC || 0);
      t.Conv += Number(r.infoCelula.Conv || 0);
      t.VP += Number(r.infoCelula.VP || 0);
      t.BA += Number(r.infoCelula.BA || 0);
      t.EVG += Number(r.infoCelula.EVG || 0);
      t.Ofrenda += Number(r.infoCelula.Ofrenda || 0);
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

      <div style={{ display: "flex", gap: 10 }}>
        <select value={anio} onChange={e => setAnio(Number(e.target.value))}>
          {[2025, 2026, 2027].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select value={semana} onChange={e => setSemana(e.target.value)}>
          <option value="">Semana</option>
          {semanas.map(s => (
            <option key={s} value={s}>Semana {s}</option>
          ))}
        </select>

        <button onClick={crear}>Crear Reporte</button>
      </div>

      {filas.length > 0 && (
        <>
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", minWidth: 900, tableLayout: "fixed" }}>
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

                    {["martes","jueves","domingo"].map(c => (
                      <td key={c}>
                        <input
                          type="number"
                          value={r.infoIglesia[c]}
                          style={styles.inputTabla}
                          onChange={e =>
                            cambiar(i, "infoIglesia", c, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    {["HNO","INV","TOT","REC","Conv","VP","BA","EVG","Ofrenda"].map(c => (
                      <td key={c}>
                        <input
                          type="number"
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
