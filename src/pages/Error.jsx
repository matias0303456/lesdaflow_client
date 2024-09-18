import { useContext } from 'react';
import { Box, Typography } from '@mui/material';

import { AuthContext } from '../providers/AuthProvider';

import { Layout } from "../components/common/Layout";
import { LoginForm } from '../components/common/LoginForm';

export function Error() {

    const { auth } = useContext(AuthContext)

    return (
        <>
            {auth ?
                <Layout title="Error 404">
                    <Typography variant="h6" noWrap component="div">
                        Página no encontrada.
                    </Typography>
                </Layout> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Box>
                        <Typography variant="h6" align="center" marginBottom={3}>
                            Inicie sesión para usar el sistema
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    )
}