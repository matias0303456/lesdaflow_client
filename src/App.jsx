import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { FiltersProvider } from "./providers/FiltersProvider";

import { Login } from "./pages/Login";
import { Clients } from './pages/Clients'
import { Users } from './pages/Users'
import { Suppliers } from "./pages/Suppliers";
import { Sales } from "./pages/Sales";
import { SalesReport } from "./pages/SalesReport";
import { Comissions } from "./pages/Comissions";
import { Discounts } from "./pages/Discounts";
import { Products } from './pages/Products'
import { ProductHistory } from "./pages/ProductHistory";
import { ProductsReport } from './pages/ProductsReport'
import { Budgets } from "./pages/Budgets";
import { Registers } from "./pages/Registers";
import { Error } from './pages/Error'
import { CurrentAccount } from "./pages/CurrentAccount";
import { ClientsBySeller } from "./pages/ClientsBySeller";
import { SalesSearch } from "./pages/SalesSearch";
import { SalesReady } from "./pages/SalesReady";
import { SalesToDeliver } from "./pages/SalesToDeliver";
import { ProductsPriceList } from "./pages/ProductsPriceList"
import { UpdateProductPriceByProduct } from "./pages/UpdateProductPriceByProduct";
import { UpdateProductPriceBySupplier } from "./pages/UpdateProductPriceBySupplier";
import { IncomesByAmount } from "./pages/IncomesByAmount";
import { BlockedCustomers } from "./pages/BlockedCustomers";
import { Settlements } from "./pages/Settlements";

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#078BCD',
      },
      terciary: {
        main: '#000000'
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <FiltersProvider>
          <MessageProvider>
            <AuthProvider>
              <CssBaseline />
              <BrowserRouter basename="distribuidora-mga">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/clientes" element={<Clients />} />
                  <Route path="/cta-cte" element={<CurrentAccount />} />
                  <Route path="/clientes-vendedor" element={<ClientsBySeller />} />
                  <Route path="/usuarios" element={<Users />} />
                  <Route path="/proveedores" element={<Suppliers />} />
                  <Route path="/ventas" element={<Sales />} />
                  <Route path="/ventas-busqueda" element={<SalesSearch />} />
                  <Route path="/reporte-ventas" element={<SalesReport />} />
                  <Route path="/comisiones" element={<Comissions />} />
                  <Route path="/descuentos" element={<Discounts />} />
                  <Route path="/prep-ventas" element={<SalesReady />} />
                  <Route path="/entrega-ventas" element={<SalesToDeliver />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/historial" element={<ProductHistory />} />
                  <Route path="/lista-precios" element={<ProductsPriceList />} />
                  <Route path="/reporte-productos" element={<ProductsReport />} />
                  <Route path="/producto-actualiza-precio-proveedor" element={<UpdateProductPriceBySupplier />} />
                  <Route path="/producto-actualiza-precio" element={<UpdateProductPriceByProduct />} />
                  <Route path="/ingresos-cantidad" element={<IncomesByAmount />} />
                  <Route path="/presupuestos" element={<Budgets />} />
                  <Route path="/movimientos-caja" element={<Registers />} />
                  <Route path="/reportes-clientes-bloqueados" element={<BlockedCustomers />} />
                  <Route path="/liquidaciones" element={<Settlements />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </MessageProvider>
        </FiltersProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App
