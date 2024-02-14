import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from "date-fns";
import es from 'date-fns/locale/es';

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { DataGrid } from "./DataGrid";
import { ModalComponent } from "./ModalComponent";
import { PaymentFilter } from "../components/filters/PaymentFilter";

import { PAYMENT_URL } from "../utils/urls";

export function Payments({ sale, setSale, loading, setLoading }) {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(PAYMENT_URL)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            amount: '',
            sale_id: sale.id,
            date: new Date(Date.now())
        },
        rules: {
            amount: {
                required: true
            },
            date: {
                required: true
            }
        }
    })

    const [open, setOpen] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            setLoading(true)
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSale({ ...sale, payments: [data, ...sale.payments] })
                    setMessage('Pago creado correctamente.')
                } else {
                    setSale({ ...sale, payments: [data, ...sale.payments.filter(p => p.id !== formData.id)] })
                    setMessage('Pago editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setLoading(false)
            setOpenMessage(true)
        }
    }

    async function handleDelete(elements) {
        setLoading(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSale({ ...sale, payments: [...sale.payments.filter(s => !ids.includes(s.id))] })
            setMessage(`${result.length === 1 ? 'Pago eliminado' : 'Pagos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoading(false)
        setOpen(null)
    }

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Monto',
            accessor: (row) => `$${row.amount}`
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd-MM-yyyy')
        }
    ]

    return (
        <>
            {disabled || loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <PaymentFilter sale={sale} />
                    <DataGrid
                        title="Pagos realizados"
                        headCells={headCells}
                        rows={sale.payments}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                    >
                        <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {open === 'NEW' && 'Nuevo pago'}
                                {open === 'EDIT' && 'Editar pago'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel htmlFor="amount">Monto</InputLabel>
                                        <Input id="amount" type="number" name="amount" value={formData.amount} />
                                        {errors.amount?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La cantidad es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                            <DatePicker
                                                label="Fecha"
                                                value={new Date(formData.date)}
                                                onChange={value => handleChange({
                                                    target: {
                                                        name: 'date',
                                                        value: new Date(value.toISOString())
                                                    }
                                                })}
                                            />
                                        </LocalizationProvider>
                                        {errors.date?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La fecha es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        marginTop: 1,
                                        width: '50%'
                                    }}>
                                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                                            width: '50%'
                                        }}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={disabled} sx={{
                                            width: '50%'
                                        }}>
                                            Guardar
                                        </Button>
                                    </FormControl>
                                </Box>
                            </form>
                        </ModalComponent>
                    </DataGrid>
                </>
            }
        </>
    )
}