import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { Layout } from "../components/common/Layout";

export function BlockedCustomers() {

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate()

  useEffect(() => {
    if (auth?.user.role !== "ADMINISTRADOR") navigate("/productos");
  }, []);

  return (
    <Layout title="Reporte de Clientes Bloqueados">
      <Box sx={{ width: { xs: '100%', sm: '50%' } }} className="p-2 bg-white rounded-md">
        <Typography
          variant="h6"
          sx={{
            width: "100%",
            fontSize: "14px",
            color: "white",
            paddingX: "10px",
            paddingY: "5px",
            backgroundColor: "#078BCD",
            borderRadius: "2px",
            fontWeight: "bold",
          }}
        >
          Clientes Bloqueados
        </Typography>
        <Box className="mt-3">
          <Button variant="contained" color="primary">Imprimir</Button>
        </Box>
      </Box>
    </Layout>
  );
}
