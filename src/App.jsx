import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";

import { Login } from "./pages/Login";
import { Clients } from './pages/Clients'
import { Users } from './pages/Users'
import { Suppliers } from "./pages/Suppliers";
import { Sales } from "./pages/Sales";
import { Articles } from './pages/Articles'
import { Budgets } from "./pages/Budgets";
import { Registers } from "./pages/Registers";
import { Error } from './pages/Error'

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#050622',
      },
      terciary: {
        main: '#000000'
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <MessageProvider>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter basename="sistema-chicho">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/proveedores" element={<Suppliers />} />
                <Route path="/boletas" element={<Sales />} />
                <Route path="/articulos" element={<Articles />} />
                <Route path="/presupuestos" element={<Budgets />} />
                <Route path="/cajas" element={<Registers />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </MessageProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App
