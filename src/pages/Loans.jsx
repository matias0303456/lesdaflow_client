import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, FormControlLabel, LinearProgress, Tab, Tabs, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useLoans } from "../hooks/useLoans";
import { useUsers } from "../hooks/useUsers";
import { useSpendings } from "../hooks/useSpendings";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { LoginForm } from "../components/common/LoginForm";
import { ShowLoansDetails } from "../components/loans/ShowLoansDetails";
import { LoanForm } from "../components/loans/LoanForm";

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
        setLoans,
        valueTab,
        setValueTab,
        handleSubmit,
        includeSpendings,
        setIncludeSpendings
    } = useLoans()
    const { loadingClients, getClients, clients } = useClients()
    const { loadingUser, getUser, user } = useUsers()
    const { spendings, getSpendings, loadingSpendings } = useSpendings()
    const { formData, setFormData, disabled, reset, setDisabled, validate, errors, handleChange } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            amount: '',
            interest: '',
            date: new Date(Date.now()),
            late_fee: '',
            payments_amount: 1,
            payments_frequency: '',
            observations: ''
        },
        rules: {
            client_id: {
                required: true
            },
            amount: {
                required: true
            },
            late_fee: {
                required: true
            },
            payments_amount: {
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
            getSpendings()
        }
    }, [])

    useEffect(() => {
        if (auth) getLoans()
    }, [valueTab])

    const handleChangeTab = (_, newValueTab) => setValueTab(newValueTab)
    const handleClose = () => reset(setOpen)

    return (
        <>
            {auth ?
                <Layout title="Préstamos">
                    {loadingLoans || loadingClients || loadingUser || loadingSpendings ?
                        <Box sx={{ width: '100%', m: 1 }}>
                            <LinearProgress />
                        </Box> :
                        <Box sx={{ mx: 1 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                                    {PAYMENT_FREQUENCIES.map((f, idx) => <Tab key={f} label={f} {...a11yProps(idx)} />)}
                                </Tabs>
                            </Box>
                            <Box sx={{ pt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Button sx={{ mb: 1, color: '#FFF' }} variant="contained" onClick={() => {
                                        setFormData({
                                            ...formData,
                                            payments_frequency: PAYMENT_FREQUENCIES[valueTab],
                                            late_fee: user.settings.late_fee
                                        })
                                        setOpen('NEW')
                                    }}>
                                        Agregar
                                    </Button>
                                    <FormControlLabel
                                        label="Incluir gastos"
                                        control={<Checkbox />}
                                        checked={includeSpendings}
                                        onChange={(e) => setIncludeSpendings(e.target.checked)}
                                    />
                                </Box>
                                <ShowLoansDetails
                                    loans={loans}
                                    setLoans={setLoans}
                                    frequency={PAYMENT_FREQUENCIES[valueTab]}
                                    setFormDataLoan={setFormData}
                                    setOpenLoan={setOpen}
                                    includeSpendings={includeSpendings}
                                    spendings={spendings}
                                />
                            </Box>
                            <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={handleClose}>
                                <Typography variant="h6" marginBottom={3}>
                                    {open === 'NEW' && 'Nuevo préstamo'}
                                    {open === 'EDIT' && `Editar préstamo #${formData.id}`}
                                </Typography>
                                <LoanForm
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    clients={clients}
                                    formData={formData}
                                    errors={errors}
                                    validate={validate}
                                    reset={reset}
                                    disabled={disabled}
                                    setDisabled={setDisabled}
                                    handleClose={handleClose}
                                />
                            </ModalComponent>
                            <ModalComponent open={open === 'DELETE'} onClose={handleClose} reduceWidth={900}>
                                <Typography variant="h6" marginBottom={1} textAlign="center">
                                    Confirmar eliminación de préstamo
                                </Typography>
                                <Typography variant="body1" marginBottom={2} textAlign="center">
                                    Los datos no podrán recuperarse
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '35%' }}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        disabled={disabled}
                                        sx={{ width: '35%', color: '#FFF' }}
                                        onClick={() => handleDelete(formData, reset)}
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