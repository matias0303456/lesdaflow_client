import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Container } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

import { AuthContext } from "./contexts/AuthContext";

import { Home } from "./pages/Home"
import { Login } from "./pages/Login";
import { Inventory } from "./pages/Inventory";

function App() {

  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')))

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>
        <CssBaseline />
        <Container maxWidth="xl">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inventario" element={<Inventory />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </AuthContext.Provider>
    </>
  )
}

export default App
