import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Products } from './pages/Products'
import { Incomes } from "./pages/Incomes";
import { Sales } from "./pages/Sales";
import { Clients } from './pages/Clients'
import { Payments } from "./pages/Payments";
import { Suppliers } from './pages/Suppliers'
import { Users } from './pages/Users'
import { Reports } from "./pages/Reports";
import { Error } from './pages/Error'
import { Profile } from './pages/Profile'

function App() {
  return (
    <MessageProvider>
      <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/veroshop/" element={<Login />} />
            <Route path="/veroshop/productos" element={<Products />} />
            <Route path="/veroshop/login" element={<Login />} />
            <Route path="/veroshop/ingresos" element={<Incomes />} />
            <Route path="/veroshop/ventas" element={<Sales />} />
            <Route path="/veroshop/clientes" element={<Clients />} />
            <Route path="/veroshop/pagos" element={<Payments />} />
            <Route path="/veroshop/proveedores" element={<Suppliers />} />
            <Route path="/veroshop/usuarios" element={<Users />} />
            <Route path="/veroshop/reportes" element={<Reports />} />
            <Route path="/veroshop/perfil" element={<Profile />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MessageProvider>
  )
}

export default App
