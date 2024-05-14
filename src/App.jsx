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
import { Error } from './pages/Error'
// import { Roles } from "./pages/Roles";
import { CurrentAccount } from "./pages/CurrentAccount";
import { ClientsBySeller } from "./pages/ClientsBySeller";
import { SalesSearch } from "./pages/SalesSearch";
import { SalesReady } from "./pages/SalesReady";
import { SalesToDeliver } from "./pages/SalesToDeliver";
import {ProductsPriceList } from "./pages/ProductsPriceList"
import { UpdateProductPriceByProduct } from "./pages/UpdateProductPriceByProduct";
import { StockReplenishment } from "./pages/StockReplenishment";
import { UpdateProductPriceBySupplier } from "./pages/UpdateProductPriceBySupplier";
import {Orders} from "./pages/Orders";
import { OrdersCheckIn } from "./pages/OrdersCheckIn";
import { OpenRegister } from "./pages/OpenRegister";
import { RegisterMovements } from "./pages/RegisterMovements";
import { BlockedCustomers } from "./pages/BlockedCustomers";
import { Sellers } from "./pages/Sellers";

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#078BCD',
      },
      terciary:{
        main: '#000000'
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
              <Route path="/usuarios" element={<Users />} />
              {/* <Route path="/roles" element={<Roles />} /> */}
              <Route path="/proveedores" element={<Suppliers />} />
              <Route path="/vendedores" element={<Sellers />} />
              <Route path="/ventas" element={<Sales />} />
              <Route path="/ventas-busqueda" element={<SalesSearch />} />
              <Route path="/reporte-ventas" element={<SalesReport />} />
              <Route path="/prep-ventas" element={<SalesReady />} />
              <Route path="/entrega-ventas" element={<SalesToDeliver />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/lista-precios" element={<ProductsPriceList />} />
              <Route path="/reporte-productos" element={<ProductsReport />} />
              <Route
                path="/producto-actualiza-precio-proveedor"
                element={<UpdateProductPriceBySupplier />}
              />
              <Route
                path="/reposicion-stock"
                element={<StockReplenishment />}
              />
              <Route
                path="/producto-actualiza-precio"
                element={<UpdateProductPriceByProduct />}
              />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="/ingreso-pedidos" element={<OrdersCheckIn />} />
              <Route path="/presupuestos" element={<Budgets />} />
              <Route path="/cajas" element={<Registers />} />
              <Route path="/movimientos-caja" element={<OpenRegister />} />
              <Route path="/reporte-movimientos-caja" element={<RegisterMovements />} />
              <Route path="/reporte-movimientos-caja" element={<RegisterMovements />} />
              <Route path="/reportes-clientes-bloqueados" element={<BlockedCustomers />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default App
