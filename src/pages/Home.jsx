import { Box } from "@mui/material";
import { LoginForm } from "../components/common/LoginForm";

export function Home() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoginForm showLogo />
        </Box>
    )
}