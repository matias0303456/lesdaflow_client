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
            <Route path="/lesdaflow/" element={<Login />} />
            <Route path="/lesdaflow/productos" element={<Products />} />
            <Route path="/lesdaflow/login" element={<Login />} />
            <Route path="/lesdaflow/ingresos" element={<Incomes />} />
            <Route path="/lesdaflow/egresos" element={<Outcomes />} />
            <Route path="/lesdaflow/clientes" element={<Clients />} />
            <Route path="/lesdaflow/proveedores" element={<Suppliers />} />
            <Route path="/lesdaflow/usuarios" element={<Users />} />
            <Route path="/lesdaflow/reportes" element={<Reports />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MessageProvider>
  )
}

export default App
