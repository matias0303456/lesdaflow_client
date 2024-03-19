import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Products } from './pages/Products'
import { Incomes } from "./pages/Incomes";
import { Outcomes } from "./pages/Outcomes";
import { Sales } from "./pages/Sales";
import { Registers } from "./pages/Registers";
import { SaleDetails } from "./pages/SaleDetails";
import { Clients } from './pages/Clients'
import { Suppliers } from './pages/Suppliers'
import { Users } from './pages/Users'
import { Reports } from "./pages/Reports";
import { Error } from './pages/Error'
import { Profile } from './pages/Profile'

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#078BCD',
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <AuthProvider>
          <CssBaseline />
          <BrowserRouter basename="distribuidora-mga">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ingresos" element={<Incomes />} />
              <Route path="/egresos" element={<Outcomes />} />
              <Route path="/ventas" element={<Sales />} />
              <Route path="/cajas" element={<Registers />} />
              <Route path="/cuenta/:id" element={<SaleDetails />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/proveedores" element={<Suppliers />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/reportes" element={<Reports />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  )
}

export default App
