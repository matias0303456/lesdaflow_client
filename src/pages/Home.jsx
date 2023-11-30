import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Home() {

    const navigate = useNavigate()

    return (
        <div>
            <h1>home</h1>
            <Button variant="contained" onClick={() => navigate('/login')}>Ingresar</Button>
        </div>
    )
}