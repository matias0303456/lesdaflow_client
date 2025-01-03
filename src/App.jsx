import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Home } from "./pages/Home"
import { Login } from "./pages/Login";
import { Inventory } from "./pages/Inventory";
import { Incomes } from "./pages/Incomes";
import { Outcomes } from './pages/Outcomes'
import { Articles } from './pages/Articles'
import { Clients } from './pages/Clients'
import { Suppliers } from './pages/Suppliers'
import { Categories } from './pages/Categories'
import { Users } from './pages/Users'
import { Returns } from "./pages/Returns";
import { Reports } from "./pages/Reports";
import { Profile } from "./pages/Profile";
import { Error } from './pages/Error'

function App() {
  return (
    <MessageProvider>
      <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/lesdaflow/" element={<Home />} />
            <Route path="/lesdaflow/login" element={<Login />} />
            <Route path="/lesdaflow/inventario" element={<Inventory />} />
            <Route path="/lesdaflow/ingresos" element={<Incomes />} />
            <Route path="/lesdaflow/egresos" element={<Outcomes />} />
            <Route path="/lesdaflow/articulos" element={<Articles />} />
            <Route path="/lesdaflow/clientes" element={<Clients />} />
            <Route path="/lesdaflow/proveedores" element={<Suppliers />} />
            <Route path="/lesdaflow/categorias" element={<Categories />} />
            <Route path="/lesdaflow/usuarios" element={<Users />} />
            <Route path="/lesdaflow/devoluciones" element={<Returns />} />
            <Route path="/lesdaflow/reportes" element={<Reports />} />
            <Route path="/lesdaflow/perfil" element={<Profile />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MessageProvider>
  )
}

export default App
