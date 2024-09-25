import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Home } from "./pages/Home";
import { Clients } from './pages/Clients'
import { Users } from './pages/Users'
import { Loans } from "./pages/Loans";
import { Error } from './pages/Error'
import { Spendings } from "./pages/Spendings";

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#6ABA41',
      },
      terciary: {
        main: '#000000'
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <AuthProvider>
          <CssBaseline />
          <BrowserRouter basename="prestamos-personales">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/prestamos" element={<Loans />} />
              <Route path="/gastos" element={<Spendings />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default App
