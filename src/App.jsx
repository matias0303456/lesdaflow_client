import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { PageProvider } from "./providers/PageProvider";
import { SearchProvider } from "./providers/SearchProvider";

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
        main: '#8B4992',
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <AuthProvider>
          <PageProvider>
            <SearchProvider>
              <CssBaseline />
              <BrowserRouter>
                <Routes>
                  <Route path="/veroshop/" element={<Login />} />
                  <Route path="/veroshop/productos" element={<Products />} />
                  <Route path="/veroshop/login" element={<Login />} />
                  <Route path="/veroshop/ingresos" element={<Incomes />} />
                  <Route path="/veroshop/egresos" element={<Outcomes />} />
                  <Route path="/veroshop/ventas" element={<Sales />} />
                  <Route path="/veroshop/cajas" element={<Registers />} />
                  <Route path="/veroshop/cuenta/:id" element={<SaleDetails />} />
                  <Route path="/veroshop/clientes" element={<Clients />} />
                  <Route path="/veroshop/proveedores" element={<Suppliers />} />
                  <Route path="/veroshop/usuarios" element={<Users />} />
                  <Route path="/veroshop/reportes" element={<Reports />} />
                  <Route path="/veroshop/perfil" element={<Profile />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </BrowserRouter>
            </SearchProvider>
          </PageProvider>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  )
}

export default App
