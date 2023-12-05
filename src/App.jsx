import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Container } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

import { MessageProvider } from "./contexts/MessageProvider";
import { AuthContext } from "./contexts/AuthContext";
import { ArticleProvider } from "./contexts/ArticleProvider";

import { Home } from "./pages/Home"
import { Login } from "./pages/Login";
import { Inventory } from "./pages/Inventory";
import { Incomes } from "./pages/Incomes";
import { Outcomes } from './pages/Outcomes'
import { Articles } from './pages/Articles'
import { Clients } from './pages/Clients'
import { Suppliers } from './pages/Suppliers'
import { Categories } from './pages/Categories'
import { Users } from './pages/Users'
import { Profile } from "./pages/Profile";
import { Error } from './pages/Error'

function App() {

  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')))

  return (
    <MessageProvider>
      <AuthContext.Provider value={{ auth, setAuth }}>
        <ArticleProvider>
          <CssBaseline />
          <Container maxWidth="xl">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inventario" element={<Inventory />} />
                <Route path="/ingresos" element={<Incomes />} />
                <Route path="/egresos" element={<Outcomes />} />
                <Route path="/articulos" element={<Articles />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/proveedores" element={<Suppliers />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </ArticleProvider>
      </AuthContext.Provider>
    </MessageProvider>
  )
}

export default App
