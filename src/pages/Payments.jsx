import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from "date-fns";
import es from 'date-fns/locale/es';

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { usePayments } from "../hooks/usePayments";
import { useClients } from "../hooks/useClients"

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { PaymentFilter } from "../components/filters/PaymentFilter";

import { PAYMENT_URL } from "../utils/urls";
import { setLocalDate } from "../utils/helpers";

export function Payments() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(PAYMENT_URL)
    const { clients, loadingClients } = useClients()
    const { payments, setPayments, loadingPayments, setLoadingPayments } = usePayments()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            sale_id: '',
            amount: '',
            date: Date.now()
        },
        rules: {
            sale_id: {
                required: true
            },
            amount: {
                required: true
            },
            date: {
                required: true
            }
        }
    })

    const [open, setOpen] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)

    useEffect(() => {
        if (open === 'EDIT') setSelectedClient(clients.find(c => c.id === formData.sale.client_id))
    }, [open])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setPayments([data, ...payments])
                    setMessage('Pago creado correctamente.')
                } else {
                    setPayments([data, ...payments.filter(p => p.id !== formData.id)])
                    setMessage('Pago editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
                setSelectedClient(null)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(elements) {
        setLoadingPayments(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setPayments([...payments.filter(s => !ids.includes(s.id))])
            setMessage(`${result.length === 1 ? 'Pago eliminado' : 'Pagos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingPayments(false)
        setOpen(null)
        setSelectedClient(null)
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
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.sale.client.first_name} ${row.sale.client.last_name} (${row.sale.client.code})`
        },
        {
            id: 'sale',
            numeric: false,
            disablePadding: true,
            label: 'Venta',
            accessor: (row) => `${format(new Date(row.sale.date), 'dd-MM-yyyy')} / ${row.sale.product.details} (${row.sale.product.code}) de ${row.sale.product.supplier.name}`
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
        },
        {
            id: 'user',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: (row) => row.sale.client.user.username
        }
    ]

    return (
        <Layout title="Pagos">
            {loadingPayments || loadingClients || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <PaymentFilter payments={payments} setPayments={setPayments} />
                    <DataGrid
                        title="Pagos realizados"
                        headCells={headCells}
                        rows={payments}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                    >
                        <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => {
                            reset(setOpen)
                            setSelectedClient(null)
                        }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {open === 'NEW' && 'Nuevo pago'}
                                {open === 'EDIT' && 'Editar pago'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel id="client-select">Cliente</InputLabel>
                                        <Select
                                            labelId="client-select"
                                            id="client_id"
                                            value={selectedClient?.id ?? ''}
                                            label="Cliente"
                                            name="client_id"
                                            onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value))}
                                        >
                                            {clients.map(c => (
                                                <MenuItem key={c.id} value={c.id}>{`${c.code} - ${c.first_name} ${c.last_name}`}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id="sale-select">Venta</InputLabel>
                                        <Select
                                            labelId="sale-select"
                                            id="sale_id"
                                            value={formData.sale_id}
                                            label="Venta"
                                            name="sale_id"
                                            onChange={handleChange}
                                            disabled={!selectedClient}
                                        >
                                            {selectedClient?.sales.map(s => (
                                                <MenuItem key={s.id} value={s.id}>{`${format(setLocalDate(s.date), 'dd-MM-yyyy')} / ${s.product.details} (${s.product.code}) de ${s.product.supplier.name}`}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                                        marginTop: 1
                                    }}>
                                        <Button type="button" variant="outlined" onClick={() => {
                                            reset(setOpen)
                                            setSelectedClient(null)
                                        }} sx={{
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
        </Layout>
    )
}