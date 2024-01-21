import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { SALE_URL } from "../utils/urls";
import { getDeadline } from "../utils/helpers";

export function Sales() {

    const { get, post, put, destroy } = useApi(SALE_URL)

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { products, loadingProducts } = useProducts(true)
    const { clients, loadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            product_id: '',
            client_id: '',
            amount: '',
            discount: '',
            installments: '',
            observations: '',
            date: Date.now()
        },
        rules: {
            product_id: {
                required: true
            },
            client_id: {
                required: true
            },
            amount: {
                required: true
            },
            date: {
                required: true
            },
            installments: {
                required: true
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [loadingOutcomes, setLoadingOutcomes] = useState(true)
    const [outcomes, setOutcomes] = useState([])
    const [open, setOpen] = useState(null)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setOutcomes(data)
                setLoadingOutcomes(false)
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setOutcomes([data, ...outcomes])
                    setMessage('Venta creada correctamente.')
                } else {
                    setOutcomes([data, ...outcomes.filter(out => out.id !== formData.id)])
                    setMessage('Venta editada correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(elements) {
        setLoadingOutcomes(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setOutcomes([...outcomes.filter(out => !ids.includes(out.id))])
            setMessage(`${result.length === 1 ? 'Venta eliminada' : 'Ventas eliminadas'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingOutcomes(false)
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
            id: 'product',
            numeric: false,
            disablePadding: true,
            label: 'Producto',
            accessor: (row) => `${row.product.name} (${row.product.code})`
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name} (${row.client.code})`
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio unitario',
            accessor: (row) => row.product.price
        },
        {
            id: 'discount',
            numeric: false,
            disablePadding: true,
            label: 'Descuento',
            accessor: (row) => `${row.discount}%`
        },
        {
            id: 'installments',
            numeric: false,
            disablePadding: true,
            label: 'Cuotas',
            accessor: 'installments'
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => ((row.product.price * row.amount) - (((row.product.price * row.amount) / 100) * row.discount)).toFixed(2)
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            accessor: 'observations'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha creación',
            accessor: (row) => format(new Date(row.date), 'dd-MM-yyyy')
        },
        {
            id: 'deadline',
            numeric: false,
            disablePadding: true,
            label: 'Fecha vencimiento',
            accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd-MM-yyyy')
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: (row) => row.client.user.username
        }
    ]

    return (
        <Layout title="Ventas">
            {loadingClients || loadingOutcomes || loadingProducts || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Ventas registradas"
                    headCells={headCells}
                    rows={outcomes}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                    deadlineColor="sales"
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nueva venta'}
                            {open === 'EDIT' && 'Editar venta'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel id="product-select">Producto</InputLabel>
                                        <Select
                                            labelId="product-select"
                                            id="product_id"
                                            value={formData.product_id}
                                            label="Producto"
                                            name="product_id"
                                            onChange={handleChange}
                                        >
                                            {products.map(p => (
                                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.product_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El producto es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id="client-select">Cliente</InputLabel>
                                        <Select
                                            labelId="client-select"
                                            id="client_id"
                                            value={formData.client_id}
                                            label="Cliente"
                                            name="client_id"
                                            onChange={handleChange}
                                        >
                                            {clients.map(c => (
                                                <MenuItem key={c.id} value={c.id}>{`${c.code} - ${c.first_name} ${c.last_name}`}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.client_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El cliente es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="amount">Cantidad</InputLabel>
                                        <Input id="amount" type="number" name="amount" value={formData.amount} />
                                        {errors.amount?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La cantidad es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
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
                                    <FormControl>
                                        <InputLabel htmlFor="discount">Descuento</InputLabel>
                                        <Input id="discount" type="number" name="discount" value={formData.discount} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="installments">Cantidad Cuotas</InputLabel>
                                        <Input id="installments" type="number" name="installments" value={formData.installments} />
                                        {errors.installments?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las cuotas son requeridas.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                        <Input id="observations" type="text" name="observations" value={formData.observations} />
                                        {errors.observations?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las observaciones son demasiado largas.
                                            </Typography>
                                        }
                                    </FormControl>
                                </Box>
                            </Box>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                marginTop: 3
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
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout>
    )
}