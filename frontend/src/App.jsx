import { useState } from "react";
import LoginSupervisor from "./components/LoginSupervisor";
import ReporteSector from "./components/ReporteSector";
import VistaPastor from "./components/pastor/VistaPastor";

function App() {
  const [usuario, setUsuario] = useState(null);

  // 🔐 LOGIN
  if (!usuario) {
    return <LoginSupervisor setUsuario={setUsuario} />;
  }

  // 👑 PASTOR
  if (usuario.rol === "PASTOR") {
    return <VistaPastor onLogout={() => setUsuario(null)} />;
  }

  // 👤 SUPERVISOR
  return (
    <ReporteSector
      usuario={usuario}           // ⬅️ OBLIGATORIO
      onLogout={() => setUsuario(null)}
    />
  );
}

export default App;
