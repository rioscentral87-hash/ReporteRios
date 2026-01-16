import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* 🏛️ CONFIGURACIÓN IGLESIA */
const NOMBRE_IGLESIA = "Iglesia Cristiana Ríos de Vida";
const LOGO_URL = "/logo.png"; // debe estar en public/

/* 🔹 EXPORTAR EXCEL */
export function exportarExcel(filas, nombre) {
  const data = filas.map(r => ({
    Año: r.anio,
    Semana: r.semana,
    Sector: r.sector,
    Red: r.red,
    Líder: r.lider,
    Martes: r.infoIglesia.martes,
    Jueves: r.infoIglesia.jueves,
    Domingo: r.infoIglesia.domingo,
    HNO: r.infoCelula.HNO,
    INV: r.infoCelula.INV,
    TOT: r.infoCelula.TOT,
    REC: r.infoCelula.REC,
    Conv: r.infoCelula.Conv,
    VP: r.infoCelula.VP,
    BA: r.infoCelula.BA,
    EVG: r.infoCelula.EVG,
    Ofrenda: r.infoCelula.Ofrenda
  }));

  const hoja = XLSX.utils.json_to_sheet([]);

  /* ENCABEZADO */
  XLSX.utils.sheet_add_aoa(hoja, [
    [NOMBRE_IGLESIA],
    ["Reporte Semanal"],
    [`Fecha de exportación: ${new Date().toLocaleDateString()}`],
    []
  ], { origin: "A1" });

  /* DATOS */
  XLSX.utils.sheet_add_json(hoja, data, { origin: "A5" });

  /* AJUSTE DE COLUMNAS */
  hoja["!cols"] = Object.keys(data[0]).map(() => ({ wch: 14 }));

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Reporte");

  XLSX.writeFile(libro, `${nombre}.xlsx`);
}

/* 🔹 EXPORTAR PDF CON LOGO */
export async function exportarPDF(columnas, filas, nombre) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  /* CARGAR LOGO */
  const img = await cargarImagen(LOGO_URL);

  /* LOGO */
  pdf.addImage(img, "PNG", 40, 20, 60, 60);

  /* TITULO */
  pdf.setFontSize(16);
  pdf.text(NOMBRE_IGLESIA, 120, 45);

  pdf.setFontSize(12);
  pdf.text("Reporte Semanal", 120, 65);

  pdf.setFontSize(10);
  pdf.text(
    `Fecha de exportación: ${new Date().toLocaleDateString()}`,
    120,
    82
  );

  /* TABLA */
  autoTable(pdf, {
    startY: 100,
    head: [columnas],
    body: filas,
    styles: {
      fontSize: 8,
      cellPadding: 4
    },
    headStyles: {
      fillColor: [11, 92, 158] // azul
    }
  });

  pdf.save(`${nombre}.pdf`);
}

/* 🔹 UTIL: CARGAR IMAGEN */
function cargarImagen(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });
}
