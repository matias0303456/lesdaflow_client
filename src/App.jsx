import { BrowserRouter, Routes, Route } from "react-router-dom"
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'
import { createTheme, ThemeProvider } from "@mui/material";

import { MessageProvider } from "./providers/MessageProvider";
import { AuthProvider } from "./providers/AuthProvider";

import { Login } from "./pages/Login";
import { Clients } from './pages/Clients'
import { Users } from './pages/Users'
import { Loans } from "./pages/Loans";
import { Error } from './pages/Error'

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
      <MessageProvider>
        <AuthProvider>
          <CssBaseline />
          <BrowserRouter basename="distribuidora-mga">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/usuarios" element={<Users />} />
              {/* <Route path="/clientes" element={<Clients />} /> */}
              {/* <Route path="/prestamos" element={<Loans />} /> */}
              <Route path="*" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default App
