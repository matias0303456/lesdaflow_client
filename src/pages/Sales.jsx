import { useCallback, useContext, useEffect, useState } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import PrintSharpIcon from '@mui/icons-material/PrintSharp';

import { AuthContext } from "../providers/AuthProvider";
import { PageContext } from "../providers/PageProvider";
import { MessageContext } from "../providers/MessageProvider";
import { SearchContext } from "../providers/SearchProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { SaleFilter } from "../components/filters/SaleFilter";
import { AddProductsToSale } from "../components/commercial/AddProductsToSale";

import { CLIENT_URL, PRODUCT_URL, REPORT_URL, SALE_URL } from "../utils/urls";
import { getAccountStatus, getCurrentSubtotal, getCurrentTotal, getDeadline, getInstallmentsAmount, getSaleDifference, getSaleTotal, setLocalDate } from "../utils/helpers";

export function Sales() {

    const { page, offset, count, setCount, search } = useContext(PageContext)
    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)
    const { searchClients, setSearchClients, searchProducts, setSearchProducts } = useContext(SearchContext)

    const { get, post, put, destroy } = useApi(SALE_URL)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            installments: '',
            observations: '',
            type: 'CUENTA_CORRIENTE',
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
    const [missing, setMissing] = useState(false)
    const [idsToDelete, setIdsToDelete] = useState([])
    const [stopPointerEvents, setStopPointerEvents] = useState(false)
    const [saleSaved, setSaleSaved] = useState(null)
    const [lastModified, setLastModified] = useState([])

    useEffect(() => {
        (async () => {
            const res = await fetch(CLIENT_URL + '/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const data = await res.json()
            if (res.status === 200) setSearchClients(data)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const res = await fetch(PRODUCT_URL + '/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const data = await res.json()
            if (res.status === 200) setSearchProducts(data)
        })()
    }, [])

    const getSales = useCallback(async () => {
        const { status, data } = await get(page['sales'], offset['sales'], search)
        if (status === 200) {
            setSales(data[0])
            setCount({ ...count, 'sales': data[1] })
            setLoadingSales(false)
        }
    }, [page, offset, search])

    useEffect(() => {
        (async () => {
            await getSales()
        })()
    }, [])

    useEffect(() => {
        if (open === 'EDIT') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    useEffect(() => {
        (async () => {
            if (open === 'LAST-MODIFIED') {
                const res = await fetch(SALE_URL + '/last-modified', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth.token
                    }
                })
                const data = await res.json()
                if (res.status === 200) setLastModified(data)
            }
        })()
    }, [open])

    async function handleSubmit(e) {
        e.preventDefault()
        const submitData = {
            ...formData,
            sale_products: saleProducts,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete
        }
        const spMissing = submitData.sale_products.length === 0 || submitData.sale_products.some(sp => !sp.amount || parseInt(sp.amount) <= 0)
        if (validate() && !spMissing) {
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSales([data, ...sales])
                    setSaleSaved(data.id)
                } else {
                    setSeverity('success')
                    setSales([data, ...sales.filter(s => s.id !== formData.id)])
                    setMessage('Venta editada correctamente.')
                    setOpenMessage(true)
                }
                reset(setOpen)
                setSaleProducts([])
                setMissing(false)
                setIdsToDelete([])
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
                setOpenMessage(true)
            }
        } else {
            if (spMissing) {
                setDisabled(false)
                setMissing(true)
            }
        }
    }

    async function handleDelete(elements) {
        setLoadingSales(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSales([...sales.filter(s => !ids.includes(s.id))])
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
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'print',
            numeric: false,
            disablePadding: true,
            label: 'Detalle',
            sorter: (row) => row.id,
            accessor: (row) => (
                <PrintSharpIcon
                    sx={{
                        color: '#8B4992',
                        transition: '100ms all',
                        ":hover": {
                            transform: 'scale(1.1)'
                        }
                    }}
                    onMouseEnter={() => setStopPointerEvents(true)}
                    onMouseLeave={() => setStopPointerEvents(false)}
                    onClick={() => {
                        window.open(`${REPORT_URL}/account-details/${auth.token}/${row.id}`, '_blank')
                    }}
                />
            )
        },
        {
            id: 'client_code',
            numeric: false,
            disablePadding: true,
            label: 'Cód.',
            sorter: (row) => row.client.code,
            accessor: (row) => row.client.code
        },
        {
            id: 'client_name',
            numeric: false,
            disablePadding: true,
            label: 'NyA',
            sorter: (row) => row.client.name,
            accessor: (row) => row.client.name
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            sorter: (row) => parseFloat(getSaleTotal(row).replace('$', '')),
            accessor: (row) => getSaleTotal(row)
        },
        {
            id: 'deadline',
            numeric: false,
            disablePadding: true,
            label: 'Vencimiento',
            sorter: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy'),
            accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy')
        },
        {
            id: 'created_by',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: 'created_by'
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo',
            accessor: (row) => row.type.replace('CUENTA_CORRIENTE', 'CTA CTE')
        },
        {
            id: 'difference',
            numeric: false,
            disablePadding: true,
            label: 'Saldo',
            sorter: (row) => parseFloat(getSaleDifference(row).replace('$', '')),
            accessor: (row) => getSaleDifference(row)
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Estado',
            sorter: (row) => getAccountStatus(row),
            accessor: (row) => getAccountStatus(row)
        }
    ]

    return (
        <Layout title="Ventas">
            {loadingSales || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <SaleFilter sales={sales} getter={getSales} setOpen={setOpen} />
                    <DataGrid
                        title=""
                        headCells={headCells}
                        rows={sales}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                        deadlineColor="sales"
                        seeAccount
                        handlePrint
                        stopPointerEvents={stopPointerEvents}
                        pageKey="sales"
                        getter={getSales}
                    >
                        <ModalComponent
                            reduceWidth={50}
                            open={open === 'NEW' || open === 'EDIT'}
                            onClose={() => {
                                setSaleProducts([])
                                setMissing(false)
                                reset(setOpen)
                                setIdsToDelete([])
                            }}
                        >
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {open === 'NEW' && 'Nueva venta'}
                                {open === 'EDIT' && 'Editar venta'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', gap: 3 }}>
                                            <FormControl>
                                                <Autocomplete
                                                    disablePortal
                                                    id="client-autocomplete"
                                                    value={formData.client_id.toString().length > 0 ? `${searchClients.find(c => c.id === formData.client_id)?.code} - ${searchClients.find(c => c.id === formData.client_id)?.name}` : ''}
                                                    options={searchClients.map(c => ({ label: `${c.code} - ${c.name}`, id: c.id }))}
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
                                                searchProducts={searchProducts}
                                                saleProducts={saleProducts}
                                                setSaleProducts={setSaleProducts}
                                                missing={missing}
                                                setMissing={setMissing}
                                                idsToDelete={idsToDelete}
                                                setIdsToDelete={setIdsToDelete}
                                                open={open}
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
                                                <InputLabel htmlFor="discount">% Descuento</InputLabel>
                                                <Input
                                                    id="discount"
                                                    type="number"
                                                    name="discount"
                                                    value={formData.discount}
                                                    disabled={formData.type === 'CUENTA_CORRIENTE'}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="installments">Cantidad Cuotas</InputLabel>
                                                <Input
                                                    id="installments"
                                                    type="number"
                                                    name="installments"
                                                    value={formData.installments}
                                                    disabled={formData.type === 'CONTADO'}
                                                />
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
                                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="Cuenta Corriente"
                                                    checked={formData.type === 'CUENTA_CORRIENTE'}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                type: 'CUENTA_CORRIENTE',
                                                                discount: 0
                                                            })
                                                        }
                                                    }}
                                                />
                                                <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="Contado"
                                                    checked={formData.type === 'CONTADO'}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFormData({
                                                                ...formData,
                                                                type: 'CONTADO',
                                                                installments: 1
                                                            })
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                        <FormControl>
                                            <InputLabel htmlFor="subtotal">Subtotal</InputLabel>
                                            <Input value={getCurrentSubtotal(saleProducts, searchProducts)} id="subtotal" type="number" name="subtotal" disabled />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="total">Total</InputLabel>
                                            <Input value={getCurrentTotal(formData, saleProducts, searchProducts)} id="total" type="number" name="total" disabled />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="inst_amount">Monto por cuota</InputLabel>
                                            <Input
                                                id="inst_amount" type="number" name="total" disabled
                                                value={getInstallmentsAmount(getCurrentTotal(formData, saleProducts, searchProducts), formData.installments)}
                                            />
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
                                        setMissing(false)
                                        reset(setOpen)
                                        setIdsToDelete([])
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
                    <ModalComponent
                        reduceWidth={800}
                        open={saleSaved !== null}
                        onClose={() => setSaleSaved(null)}
                    >
                        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Venta creada correctamente
                        </Typography>
                        <Button type="submit" variant="contained"
                            sx={{
                                width: '50%',
                                display: 'block',
                                margin: '0 auto'
                            }}
                            onClick={() => {
                                window.open(`${REPORT_URL}/account-details/${auth.token}/${saleSaved}`, '_blank')
                                setSaleSaved(null)
                            }}
                        >
                            Compartir comprobante
                        </Button>
                    </ModalComponent>
                    <ModalComponent
                        reduceWidth={800}
                        open={open === 'LAST-MODIFIED'}
                        onClose={() => setOpen(null)}
                    >
                        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Últimas boletas modificadas
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">N° venta</TableCell>
                                        <TableCell align="center">Cliente</TableCell>
                                        <TableCell align="center">Modificado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lastModified.map(item => {
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell align="center">{item.id}</TableCell>
                                                <TableCell align="center">{item.client.name}</TableCell>
                                                <TableCell align="center">{format(setLocalDate(item.updated_at), 'dd-MM-yy hh:mm:ss')}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => setOpen(null)}
                                sx={{ marginTop: 1 }}
                            >
                                Cerrar
                            </Button>
                        </Box>
                    </ModalComponent>
                </>
            }
        </Layout>
    )
}