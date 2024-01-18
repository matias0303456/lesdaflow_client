import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Products } from './pages/Products'
import { Incomes } from "./pages/Incomes";
import { Outcomes } from './pages/Outcomes'
import { Clients } from './pages/Clients'
import { Suppliers } from './pages/Suppliers'
import { Users } from './pages/Users'
import { Reports } from "./pages/Reports";
import { Error } from './pages/Error'

function App() {
  return (
    <MessageProvider>
      <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/mga/" element={<Login />} />
            <Route path="/mga/productos" element={<Products />} />
            <Route path="/mga/login" element={<Login />} />
            <Route path="/mga/ingresos" element={<Incomes />} />
            <Route path="/mga/egresos" element={<Outcomes />} />
            <Route path="/mga/clientes" element={<Clients />} />
            <Route path="/mga/proveedores" element={<Suppliers />} />
            <Route path="/mga/usuarios" element={<Users />} />
            <Route path="/mga/reportes" element={<Reports />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MessageProvider>
  )
}

export default App
