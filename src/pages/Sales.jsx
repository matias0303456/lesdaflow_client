import { useContext, useEffect } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useSales } from "../hooks/useSales";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
// import { SaleFilter } from "../components/filters/SaleFilter";
import { AddProductsToSale } from "../components/commercial/AddProductsToSale";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

import { REPORT_URL } from "../utils/urls";
import { getCurrentSubtotal, getCurrentTotal, getInstallmentsAmount, getSaleTotal } from "../utils/helpers";

export function Sales() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        loadingSales,
        setSaleProducts,
        open,
        setOpen,
        setMissing,
        setIdsToDelete,
        saleProducts,
        missing,
        idsToDelete,
        saleSaved,
        setSaleSaved,
        handleSubmit,
        handleDelete,
        getSales
    } = useSales()
    const { loadingProducts, getProducts } = useProducts()
    const { loadingClients, getClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            discount: '',
            installments: '',
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
            }
        }
    })

    useEffect(() => {
        getClients()
        getProducts()
    }, [])

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setSaleProducts(formData.sale_products)
        }
    }, [formData])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Venta',
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
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
            accessor: (row) => format(new Date(row.date), 'hh:mm')
        },
        {
            id: 'created_by',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: 'created_by'
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            accessor: (row) => row.client.work_place
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.address
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'Tipo Comprobante',
            accessor: 'type'
        },
        {
            id: 'paid',
            numeric: false,
            disablePadding: true,
            label: 'Pagado',
            accessor: (row) => ''
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => getSaleTotal(row)
        },
        {
            id: 'register',
            numeric: false,
            disablePadding: true,
            label: 'Caja',
            accessor: (row) => ''
        },
        {
            id: 'delivered',
            numeric: false,
            disablePadding: true,
            label: 'Entregado',
            accessor: (row) => ''
        },
        {
            id: 'imp',
            numeric: false,
            disablePadding: true,
            label: 'Imp',
            accessor: (row) => ''
        },
    ]

    return (
        <Layout title="Ventas">
            <DataGridWithBackendPagination
                loading={loadingClients || loadingSales || loadingProducts || disabled}
                headCells={headCells}
                rows={state.sales.data}
                entityKey="sales"
                getter={getSales}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction
                showViewAction
                showDeleteAction
                showPDFAction
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
                        </Box>
                        {/* <SaleFilter sales={sales} setSales={setSales} /> */}
                    </Box>
                }
            >
                <ModalComponent
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
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, validate, reset, setDisabled)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', gap: 3 }}>
                                    <FormControl>
                                        <Autocomplete
                                            disablePortal
                                            id="client-autocomplete"
                                            value={formData.client_id.toString().length > 0 ? `${state.clients.data.find(c => c.id === formData.client_id)?.first_name} - ${state.clients.data.find(c => c.id === formData.client_id)?.last_name}` : ''}
                                            options={state.clients.data.map(c => ({ label: `${c.first_name} - ${c.last_name}`, id: c.id }))}
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
                                        products={state.products.data}
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
                                        <FormControlLabel
                                            control={<Checkbox disabled={open === 'VIEW'} />}
                                            label="Poxipol"
                                            checked={formData.type === 'POXIPOL'}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setFormData({
                                                        ...formData,
                                                        type: 'POXIPOL',
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
                                    <Input value={getCurrentSubtotal(saleProducts, state.products.data)} id="subtotal" type="number" name="subtotal" disabled />
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="total">Total</InputLabel>
                                    <Input value={getCurrentTotal(formData, saleProducts, state.products.data)} id="total" type="number" name="total" disabled />
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="inst_amount">Monto por cuota</InputLabel>
                                    <Input
                                        id="inst_amount" type="number" name="total" disabled
                                        value={getInstallmentsAmount(getCurrentTotal(formData, saleProducts, state.products.data), formData.installments)}
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
                </ModalComponent>
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
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de venta
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
            </DataGridWithBackendPagination>
        </Layout>
    )
}