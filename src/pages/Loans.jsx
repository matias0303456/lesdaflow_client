import { useContext, useEffect } from "react";
import { Box, Button, LinearProgress, Tab, Tabs, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useLoans } from "../hooks/useLoans";
import { useUsers } from "../hooks/useUsers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { LoginForm } from "../components/common/LoginForm";
import { ShowLoansDetails } from "../components/loans/ShowLoansDetails";

import { a11yProps } from "../utils/helpers";
import { PAYMENT_FREQUENCIES } from "../utils/constants";

export function Loans() {

    const { auth } = useContext(AuthContext)

    const {
        loadingLoans,
        open,
        setOpen,
        handleDelete,
        getLoans,
        loans,
        valueTab,
        setValueTab,
        headCells
    } = useLoans()
    const { loadingClients, getClients, clients } = useClients()
    const { loadingUser, getUser, user } = useUsers()
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
            getUser()
        }
    }, [])

    useEffect(() => {
        if (auth) getLoans()
    }, [valueTab])

    const handleChangeTab = (_, newValueTab) => setValueTab(newValueTab)

    const handleClose = () => {
        reset(setOpen)
    }

    return (
        <>
            {auth ?
                <Layout title="Préstamos">
                    {loadingLoans || loadingClients || loadingUser ?
                        <Box sx={{ width: '100%', m: 1 }}>
                            <LinearProgress />
                        </Box> :
                        <Box sx={{ mx: 1 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                                    {PAYMENT_FREQUENCIES.map((f, idx) => <Tab key={f} label={f} {...a11yProps(idx)} />)}
                                </Tabs>
                            </Box>
                            <ShowLoansDetails
                                loans={loans}
                                frequency={PAYMENT_FREQUENCIES[valueTab]}
                            />
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
                        </Box>
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