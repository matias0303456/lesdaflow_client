import { useContext, useState } from "react"
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, Tab, Tabs, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { DataContext } from "../../providers/DataProvider"
import { usePayments } from "../../hooks/usePayments"

import { AddProductsToSale } from "./AddProductsToSale"
import { ModalComponent } from "../common/ModalComponent"
import { PaymentsABM } from "./PaymentsABM"
import { PaymentForm } from "./PaymentForm"

import { getCurrentSubtotal, getCurrentTotal, getInstallmentsAmount } from "../../utils/helpers"

export function SaleForm({
    saleProducts,
    setSaleProducts,
    missing,
    setMissing,
    reset,
    open,
    setOpen,
    idsToDelete,
    setIdsToDelete,
    formData,
    setFormData,
    handleSubmit,
    validate,
    disabled,
    setDisabled,
    handleChange,
    errors,
    isBlocked,
    setIsBlocked
}) {

    const { state } = useContext(DataContext)

    const { open: openPayment, setOpen: setOpenPayment } = usePayments()

    const [valueTab, setValueTab] = useState(0)

    const handleChangeTab = (_, newValue) => {
        setValueTab(newValue)
    }

    const handleClose = () => {
        setSaleProducts([])
        setMissing(false)
        reset(setOpen)
        setIdsToDelete([])
        setIsBlocked(false)
        setValueTab(0)
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function CustomTabPanel(props) {
        const { children, value, index, p = 1, ...other } = props

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p }}>{children}</Box>}
            </div>
        )
    }

    return (
        <ModalComponent
            reduceWidth={50}
            p={1}
            open={open === 'NEW' || open === 'EDIT' || open === 'VIEW' || open === 'CONVERT'}
            onClose={handleClose}
        >
            <Box sx={{ marginBottom: open === 'EDIT' && valueTab === 1 ? 0 : 1 }}>
                <Tabs value={valueTab} onChange={handleChangeTab}>
                    <Tab
                        label={open === 'EDIT' ? `Editar venta #${formData.id}` :
                            (open === 'NEW' || open === 'CONVERT') ? 'Nueva venta' :
                                open === 'VIEW' ? `Venta #${formData.id}` : ''}
                        {...a11yProps(0)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT'}
                        label="Pagos"
                        {...a11yProps(1)}
                    />
                    <Tab
                        disabled={open === 'NEW' || open === 'CONVERT' || open === 'VIEW'}
                        label="Nuevo pago"
                        {...a11yProps(2)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0}>
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
                                    {isBlocked &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * Este cliente está bloqueado.
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
                        <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '50%' }}>
                            {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                        </Button>
                        {(open === 'NEW' || open === 'EDIT' || open === 'CONVERT') &&
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={disabled || isBlocked}
                                sx={{ width: '50%' }}
                            >
                                Guardar
                            </Button>
                        }
                    </FormControl>
                </form>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1} p={0}>
                <PaymentsABM
                    rows={formData.payments ?? []}
                    handleCloseSale={handleClose}
                    handleClosePayment={() => {
                        setOpenPayment(null)
                    }}
                />
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={2}>
                <PaymentForm />
            </CustomTabPanel>
        </ModalComponent>
    )
}