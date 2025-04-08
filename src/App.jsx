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
import { SalesReport } from "./pages/SalesReport";
import { Discounts } from "./pages/Discounts";
import { Articles } from './pages/Articles'
import { ArticleHistory } from "./pages/ArticleHistory";
import { ArticlesReport } from './pages/ArticlesReport'
import { Budgets } from "./pages/Budgets";
import { Registers } from "./pages/Registers";
import { Error } from './pages/Error'
import { SalesSearch } from "./pages/SalesSearch";
import { ArticlesPriceList } from "./pages/ArticlesPriceList"
import { UpdateArticlePriceByArticle } from "./pages/UpdateArticlePriceByArticle";
import { UpdateArticlePriceBySupplier } from "./pages/UpdateArticlePriceBySupplier";
import { IncomesByAmount } from "./pages/IncomesByAmount";

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
        <MessageProvider>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter basename="distribuidora-mga">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/proveedores" element={<Suppliers />} />
                <Route path="/ventas" element={<Sales />} />
                <Route path="/ventas-busqueda" element={<SalesSearch />} />
                <Route path="/reporte-ventas" element={<SalesReport />} />
                <Route path="/descuentos" element={<Discounts />} />
                <Route path="/articulos" element={<Articles />} />
                <Route path="/historial" element={<ArticleHistory />} />
                <Route path="/lista-precios" element={<ArticlesPriceList />} />
                <Route path="/reporte-articulos" element={<ArticlesReport />} />
                <Route path="/articulo-actualiza-precio-proveedor" element={<UpdateArticlePriceBySupplier />} />
                <Route path="/articulo-actualiza-precio" element={<UpdateArticlePriceByArticle />} />
                <Route path="/ingresos-cantidad" element={<IncomesByAmount />} />
                <Route path="/presupuestos" element={<Budgets />} />
                <Route path="/movimientos-caja" element={<Registers />} />
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
