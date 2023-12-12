import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import DataThresholdingRoundedIcon from '@mui/icons-material/DataThresholdingRounded';
import AddBusinessRoundedIcon from '@mui/icons-material/AddBusinessRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

import { AuthContext } from "../providers/AuthProvider";

function FeatureCard({ text, icon }) {
    return (
        <Box sx={{
            width: {
                xs: 200,
                sm: 250
            }
        }}>
            <Typography variant="body1" color="white" textAlign="center" margin={5}>
                <Box sx={{ transform: "scale(2.5)", marginBottom: 3 }}>
                    {icon}
                </Box>
                {text}
            </Typography>
        </Box>
    )
}

export function Home() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (auth) return navigate('/lesdaflow/inventario')
    }, [])

    return (
        <Box sx={{ background: "linear-gradient(black, #140052)", minHeight: "100vh" }}>
            <Box display="flex" justifyContent="end" padding={3}>
                <Button
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                    onClick={() => navigate('/lesdaflow/login')}
                >
                    Ingresar
                </Button>
            </Box>
            <Typography variant="h1" color="white" textAlign="center" sx={{
                fontSize: { xs: 50, sm: 96 }, marginBottom: 1
            }}>
                Lesdaflow
            </Typography>
            <Box sx={{ padding: 5, display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <FeatureCard
                    icon={<DataThresholdingRoundedIcon />}
                    text="Administra los datos de tu negocio de forma segura e intuitiva"
                />
                <FeatureCard
                    icon={<AddBusinessRoundedIcon />}
                    text="Gestión de clientes y proveedores"
                />
                <FeatureCard
                    icon={<Inventory2RoundedIcon />}
                    text="Gestión de inventario"
                />
                <FeatureCard
                    icon={<ProductionQuantityLimitsRoundedIcon />}
                    text="Gestión de productos y categorías"
                />
                <FeatureCard
                    icon={<SupervisedUserCircleRoundedIcon />}
                    text="Sin límite de usuarios"
                />
                <FeatureCard
                    icon={<AssessmentRoundedIcon />}
                    text="Generación de reportes en PDF"
                />
            </Box>
        </Box>
    )
}