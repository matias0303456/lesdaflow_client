import { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
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
import { SaleFilter } from "../components/filters/SaleFilter";
import { AddProductsToSale } from "../components/AddProductsToSale";

import { SALE_URL } from "../utils/urls";
import { getDeadline, getSaleTotal } from "../utils/helpers";

export function Sales() {

    const { get, post, put, destroy } = useApi(SALE_URL)

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { products, loadingProducts } = useProducts(true)
    const { clients, loadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            installments: '',
            observations: '',
            date: new Date(Date.now())
        },
        rules: {
            client_id: {
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

    const [loadingSales, setLoadingSales] = useState(true)
    const [sales, setSales] = useState([])
    const [open, setOpen] = useState(null)
    const [saleProducts, setSaleProducts] = useState([])
    const [productsRequired, setProductsRequired] = useState(false)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSales(data)
                setLoadingSales(false)
            }
        })()
    }, [])

    useEffect(() => {
        if (open === 'EDIT') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    async function handleSubmit(e) {
        e.preventDefault()
        const submitData = {
            ...formData,
            sale_products: saleProducts
        }
        if (validate() && saleProducts.length > 0) {
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSales([data, ...sales])
                    setMessage('Venta creada correctamente.')
                } else {
                    setSales([data, ...sales.filter(out => out.id !== formData.id)])
                    setMessage('Venta editada correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
                setSaleProducts([])
                setProductsRequired(false)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        } else {
            setProductsRequired(true)
        }
    }

    async function handleDelete(elements) {
        setLoadingSales(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSales([...sales.filter(out => !ids.includes(out.id))])
            setMessage(`${result.length === 1 ? 'Venta eliminada' : 'Ventas eliminadas'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen ventas con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSales(false)
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
            label: 'Productos',
            accessor: (row) => (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Código</TableCell>
                                <TableCell align="center">Detalle</TableCell>
                                <TableCell align="center">Talle</TableCell>
                                <TableCell align="center">Proveedor</TableCell>
                                <TableCell align="center">Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {row.sale_products.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.product.code}</TableCell>
                                    <TableCell>{p.product.details}</TableCell>
                                    <TableCell>{p.product.size}</TableCell>
                                    <TableCell>{p.product.supplier.name}</TableCell>
                                    <TableCell>{p.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.name} (${row.client.code})`
        },
        {
            id: 'discount',
            numeric: false,
            disablePadding: true,
            label: 'Descuento',
            accessor: (row) => `${row.discount ?? 0}%`
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
            accessor: (row) => getSaleTotal(row)
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
            {loadingClients || loadingSales || loadingProducts || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <SaleFilter sales={sales} setSales={setSales} />
                    <DataGrid
                        title="Ventas registradas"
                        headCells={headCells}
                        rows={sales}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                        deadlineColor="sales"
                    >
                        <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => {
                            setSaleProducts([])
                            setProductsRequired(false)
                            reset(setOpen)
                        }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {open === 'NEW' && 'Nueva venta'}
                                {open === 'EDIT' && 'Editar venta'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', gap: 3 }}>
                                        <FormControl>
                                            <Autocomplete
                                                disablePortal
                                                id="client-autocomplete"
                                                value={formData.client_id.toString().length > 0 ? `${clients.find(c => c.id === formData.client_id)?.code} - ${clients.find(c => c.id === formData.client_id)?.name}` : ''}
                                                options={clients.map(c => ({ label: `${c.code} - ${c.name}`, id: c.id }))}
                                                noOptionsText="No hay clientes registrados."
                                                onChange={(e, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                                                renderInput={(params) => <TextField {...params} label="Cliente" />}
                                                isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                            />
                                            {errors.client_id?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El cliente es requerido.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <AddProductsToSale
                                            products={products}
                                            saleProducts={saleProducts}
                                            setSaleProducts={setSaleProducts}
                                            productsRequired={productsRequired}
                                            setProductsRequired={setProductsRequired}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', gap: 3 }}>
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
                                    margin: '0 auto',
                                    marginTop: 3,
                                    width: '50%'
                                }}>
                                    <Button type="button" variant="outlined" onClick={() => {
                                        setSaleProducts([])
                                        setProductsRequired(false)
                                        reset(setOpen)
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
                            </form>
                        </ModalComponent>
                    </DataGrid>
                </>
            }
        </Layout>
    )
}