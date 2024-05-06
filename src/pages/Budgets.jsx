import { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, LinearProgress, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import PrintSharpIcon from '@mui/icons-material/PrintSharp';

import { AuthContext } from "../providers/AuthProvider";
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

import { REPORT_URL, SALE_URL } from "../utils/urls";
import { getAccountStatus, getCurrentSubtotal, getCurrentTotal, getDeadline, getInstallmentsAmount, getSaleDifference, getSaleTotal } from "../utils/helpers";

export function Budgets() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(SALE_URL)
    const { products, loadingProducts } = useProducts(true)
    const { clients, loadingClients } = useClients()
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
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

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
                    setSales([data, ...sales.filter(out => out.id !== formData.id)])
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
            id: 'budget_code',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Pres.',
            accessor: 'budget_code'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
           accessor: "hour"
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
           accessor: "seller"
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Clientes',
           accessor: "client"
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
           accessor: "address"
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
           accessor: "total_amount"
        },
    ]

    return (
        <Layout title="Presupuesto">
            {loadingClients || loadingSales || loadingProducts || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <DataGrid
                        headCells={headCells}
                        rows={sales}
                        setOpen={setOpen}
                        setData={setFormData}
                        contentHeader={
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                        Agregar
                                    </Button>
                                    <Button variant="outlined" color='success'>
                                        Excel
                                    </Button>
                                    <Button variant="outlined" color='error'>
                                        pdf
                                    </Button>
                                </Box>
                                {/* <SaleFilter sales={sales} setSales={setSales} /> */}
                            </Box>
                        }
                    >
                      {/*   <ModalComponent
                            reduceWidth={50}
                            open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'}
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
                                {open === 'VIEW' && `Venta #${formData.id}`}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
                                                    disabled={open === 'VIEW'}
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
                                                        disabled={open === 'VIEW'}
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
                                                    disabled={formData.type === 'CUENTA_CORRIENTE' || open === 'VIEW'}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="installments">Cantidad Cuotas</InputLabel>
                                                <Input
                                                    id="installments"
                                                    type="number"
                                                    name="installments"
                                                    value={formData.installments}
                                                    disabled={formData.type === 'CONTADO' || open === 'VIEW'}
                                                />
                                                {errors.installments?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * Las cuotas son requeridas.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                                <Input
                                                    id="observations"
                                                    type="text"
                                                    name="observations"
                                                    value={formData.observations}
                                                    disabled={open === 'VIEW'}
                                                />
                                                {errors.observations?.type === 'maxLength' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * Las observaciones son demasiado largas.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <FormControlLabel
                                                    control={<Checkbox disabled={open === 'VIEW'} />}
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
                                                    control={<Checkbox disabled={open === 'VIEW'} />}
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
                                            <Input value={getCurrentSubtotal(saleProducts, products)} id="subtotal" type="number" name="subtotal" disabled />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="total">Total</InputLabel>
                                            <Input value={getCurrentTotal(formData, saleProducts, products)} id="total" type="number" name="total" disabled />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="inst_amount">Monto por cuota</InputLabel>
                                            <Input
                                                id="inst_amount" type="number" name="total" disabled
                                                value={getInstallmentsAmount(getCurrentTotal(formData, saleProducts, products), formData.installments)}
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
                                        {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                                    </Button>
                                    {(open === 'NEW' || open === 'EDIT') &&
                                        <Button type="submit" variant="contained" disabled={disabled} sx={{
                                            width: '50%'
                                        }}>
                                            Guardar
                                        </Button>
                                    }
                                </FormControl>
                            </form>
                        </ModalComponent> */}
                    </DataGrid>
                  {/*   <ModalComponent
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
                    </ModalComponent> */}
                </>
            }
        </Layout>
    )
}