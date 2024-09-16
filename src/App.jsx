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
import { Sales } from "./pages/Sales";
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
      <DataProvider>
        <MessageProvider>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter basename="distribuidora-mga">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/clientes" element={<Clients />} />
                <Route path="/ventas" element={<Sales />} />
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
