import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Clients } from './pages/Clients'
import { Visits } from "./pages/Visits";
import { AccountsReport } from "./pages/AccountsReport";
import { Users } from './pages/Users'
import { Suppliers } from "./pages/Suppliers";
import { Sales } from "./pages/Sales";
import { SalesReport } from "./pages/SalesReport";
import { Products } from './pages/Products'
import { ProductsReport } from './pages/ProductsReport'
import { Budgets } from "./pages/Budgets";
import { Registers } from "./pages/Registers";
import { Profile } from "./pages/Profile";
import { Error } from './pages/Error'
import { Role } from "./pages/Role";
import { CurrentAccount } from "./pages/CurrentAccount";
import { ClientsBySeller } from "./pages/ClientsBySeller";
import { SalesSearch } from "./pages/SalesSearch";
import { SalesReady } from "./pages/SalesReady";
import { SalesToDeliver } from "./pages/SalesToDeliver";

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
              <Route path="/login" element={<Login />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/visitas" element={<Visits />} />
              <Route path="/cta-cte" element={<CurrentAccount />} />
              <Route path="/reporte-cta-cte" element={<AccountsReport />} />
              <Route path="/clientes-vendedor" element={<ClientsBySeller />} />
              <Route path="/vendedor" element={<Users />} />
              <Route path="/role" element={<Role />} />
              <Route path="/proveedores" element={<Suppliers />} />
              <Route path="/ventas" element={<Sales />} />
              <Route path="/ventas-busqueda" element={<SalesSearch />} />
              <Route path="/reporte-ventas" element={<SalesReport />} />
              <Route path="/prep-ventas" element={<SalesReady />} />
              <Route path="/entrega-ventas" element={<SalesToDeliver />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/reporte-productos" element={<ProductsReport />} />
              <Route path="/presupuestos" element={<Budgets />} />
              <Route path="/cajas" element={<Registers />} />
              <Route path="/cambiar-contraseña" element={<Profile />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default App
