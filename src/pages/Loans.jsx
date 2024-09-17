import { useContext, useEffect } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useLoans } from "../hooks/useLoans";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { LoginForm } from "../components/common/LoginForm";

export function Loans() {

    const { auth } = useContext(AuthContext)

    const {
        loadingLoans,
        open,
        setOpen,
        handleDelete,
        getLoans
    } = useLoans()
    const { loadingClients, getClients } = useClients()
    const { formData, disabled, reset } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            amount: '',
            interest: '',
            date: new Date(Date.now()),
            late_fee: '',
            payments_amount: '',
            payments_frequency: '',
            observations: ''
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            amount: {
                required: true
            },
            observations: {
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        if (auth) {
            getClients()
            getLoans()
        }
    }, [])

    return (
        <>
            {auth ?
                <Layout title="Préstamos">
                    {loadingLoans || loadingClients ?
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box> :
                        <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                            <Typography variant="h6" marginBottom={1} textAlign="center">
                                Confirmar eliminación de préstamo
                            </Typography>
                            <Typography variant="body1" marginBottom={2} textAlign="center">
                                Los datos no podrán recuperarse
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    disabled={disabled}
                                    sx={{ width: '35%' }}
                                    onClick={() => handleDelete(formData)}
                                >
                                    Confirmar
                                </Button>
                            </Box>
                        </ModalComponent>
                    }
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
    );
}