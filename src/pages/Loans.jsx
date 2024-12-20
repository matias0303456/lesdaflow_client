import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, LinearProgress, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns";
import { es } from "date-fns/locale"

import { AuthContext } from "../providers/AuthProvider";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useLoans } from "../hooks/useLoans";
import { useUsers } from "../hooks/useUsers";

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
        handleDeleteFreeLoanPaymentDate,
        theresPendingLoans,
        setTheresPendingLoans,
        filter,
        setFilter
    } = useLoans()
    const { loadingClients, getClients, clients } = useClients()
    const { loadingUser, getUser, user } = useUsers()
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
            interest: {
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
        }
    }, [])

    useEffect(() => {
        if (auth) {
            const { from, to, pending } = filter
            getLoans(`?from=${from}&to=${to}&pending=${pending}`)
        }
    }, [filter])

    const handleClose = () => reset(setOpen)

    return (
        <>
            {auth ?
                <Layout title="Préstamos">
                    {loadingLoans || loadingClients || loadingUser ?
                        <Box sx={{ width: '100%', m: 1 }}>
                            <LinearProgress />
                        </Box> :
                        <Box sx={{ mx: 1 }}>
                            <Box sx={{ pt: 2 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                    flexWrap: 'wrap',
                                    gap: { xs: 2, lg: 0 }
                                }}>
                                    <Box sx={{ display: 'flex', gap: { xs: 2, md: 1 }, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Button sx={{ color: '#FFF' }} variant="contained" onClick={() => {
                                            setFormData({ ...formData, late_fee: user.settings.late_fee })
                                            setOpen('NEW')
                                        }}>
                                            Agregar
                                        </Button>
                                        <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <DatePicker
                                                    label="Desde"
                                                    value={filter.from.length === 0 ? new Date(Date.now()) : new Date(filter.from)}
                                                    disabled={formData.payments?.length > 0}
                                                    onChange={value => setFilter({ ...filter, from: new Date(value).toISOString() })}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControl sx={{ width: { xs: '100%', md: '20%' } }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                <DatePicker
                                                    label="Hasta"
                                                    value={filter.to.length === 0 ? new Date(Date.now()) : new Date(filter.to)}
                                                    disabled={formData.payments?.length > 0}
                                                    onChange={value => setFilter({ ...filter, to: new Date(value).toISOString() })}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label="Pendientes"
                                            checked={filter.pending}
                                            onChange={(e) => setFilter({ ...filter, pending: e.target.checked })}
                                        />
                                        <Button
                                            variant="outlined"
                                            sx={{ width: { xs: '100%', lg: 'auto' } }}
                                            onClick={() => setFilter({ from: '', to: '', pending: false })}
                                        >
                                            Reiniciar
                                        </Button>
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
                                    theresPendingLoans={theresPendingLoans}
                                    setTheresPendingLoans={setTheresPendingLoans}
                                    loans={loans}
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