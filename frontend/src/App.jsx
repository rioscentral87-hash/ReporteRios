import { useState } from "react";
import LoginSupervisor from "./components/LoginSupervisor";
import ReporteSector from "./components/ReporteSector";
import VistaReportes from "./components/pastor/VistaPastor";
import HistorialReportes from "./components/pastor/HistorialReportes";
import ComiteReportes from "./components/comite/ComiteReportes";

function App() {
  const [usuario, setUsuario] = useState(null);

  const logout = () => {
    setUsuario(null);
  };

  if (!usuario) {
    return <LoginSupervisor setUsuario={setUsuario} />;
  }

  if (usuario.rol === "SUPERVISOR") {
    return (
      <ReporteSector
        usuario={usuario}
        onLogout={logout}
      />
    );
  }

  if (usuario.rol === "PASTOR") {
    return (
      <VistaReportes
        usuario={usuario}
        onLogout={logout}
      />
    );
  }

  if (usuario.rol === "COMITE") {
    return (
      <ComiteReportes
        usuario={usuario}
        onLogout={logout}
      />
    );
  }

  return <p>Rol no autorizado</p>;
}

export default App;
