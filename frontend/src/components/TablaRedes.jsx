export default function TablaRedes({ filas, setFilas }) {

  const cambiar = (i, grupo, campo, valor) => {
    const copia = [...filas];
    copia[i][grupo][campo] = Number(valor || 0);
    setFilas(copia);
  };

  return (
    <table border="1" cellPadding="4">
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
        {(filas || []).map((f, i) => (
          <tr key={i}>
            <td>{f.red}</td>
            <td>{f.lider}</td>

            <td><input type="number" value={f.infoIglesia.martes} onChange={e => cambiar(i,"infoIglesia","martes",e.target.value)} /></td>
            <td><input type="number" value={f.infoIglesia.jueves} onChange={e => cambiar(i,"infoIglesia","jueves",e.target.value)} /></td>
            <td><input type="number" value={f.infoIglesia.domingo} onChange={e => cambiar(i,"infoIglesia","domingo",e.target.value)} /></td>

            {["HNO","INV","TOT","REC","Conv","VP","BA","EVG","Ofrenda"].map(c => (
              <td key={c}>
                <input
                  type="number"
                  value={f.infoCelula[c]}
                  onChange={e => cambiar(i,"infoCelula",c,e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
