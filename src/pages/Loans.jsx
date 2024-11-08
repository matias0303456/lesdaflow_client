import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, FormControlLabel, LinearProgress, Typography } from "@mui/material";

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

import { PAYMENT_FREQUENCIES } from "../utils/constants";
import { setPfColor } from "../utils/helpers";

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
        handleSubmit,
        includeSpendings,
        setIncludeSpendings,
        handleDeleteFreeLoanPaymentDate
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
            late_fee_type: 'NOMINAL',
            no_late_fee_days: 0,
            payments_amount: 1,
            payments_frequency: PAYMENT_FREQUENCIES[0],
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
            getLoans()
        }
    }, [])

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
                            <Box sx={{ pt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Button sx={{ mb: 1, color: '#FFF' }} variant="contained" onClick={() => {
                                            setFormData({ ...formData, late_fee: user.settings.late_fee })
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
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {PAYMENT_FREQUENCIES.map(pf => (
                                            <Box key={pf} sx={{ backgroundColor: setPfColor(pf), px: 1, borderRadius: 1 }}>
                                                {pf.slice(0, 3)}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                <ShowLoansDetails
                                    loans={loans}
                                    setLoans={setLoans}
                                    setFormDataLoan={setFormData}
                                    setOpenLoan={setOpen}
                                    includeSpendings={includeSpendings}
                                    spendings={spendings}
                                />
                            </Box>
                            <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={handleClose}>
                                <Typography variant="h6" marginBottom={3}>
                                    {open === 'NEW' && `Nuevo préstamo - ${formData.payments_frequency}`}
                                    {open === 'EDIT' && `Editar préstamo #${formData.id} - ${formData.payments_frequency}`}
                                </Typography>
                                <LoanForm
                                    open={open}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    clients={clients}
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                    validate={validate}
                                    reset={reset}
                                    disabled={disabled}
                                    setDisabled={setDisabled}
                                    handleClose={handleClose}
                                    handleDeleteFreeLoanPaymentDate={handleDeleteFreeLoanPaymentDate}
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