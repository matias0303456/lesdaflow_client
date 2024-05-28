import { useContext, useEffect } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, TextField, Typography, Input } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useBudgets } from "../hooks/useBudgets";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ModalComponent } from "../components/common/ModalComponent";
import { AddProductsToBudget } from "../components/commercial/AddProductsToBudget";

import { getCurrentSubtotal, getSaleTotal } from "../utils/helpers";

export function Budgets() {

    const { state } = useContext(DataContext)

    const {
        setBudgetProducts,
        loadingBudgets,
        open,
        setOpen,
        getBudgets,
        handleDelete,
        handleSubmit,
        setMissing,
        setIdsToDelete,
        budgetProducts,
        idsToDelete,
        missing
    } = useBudgets()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: ''
        },
        rules: {
            client_id: {
                required: true
            }
        }
    })

    useEffect(() => {
        if (open === 'EDIT' || open === 'VIEW') {
            setBudgetProducts(formData.budget_products)
        }
    }, [formData])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cod. Pres.',
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
            accessor: (row) => format(new Date(row.date), 'hh:ss')
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vendedor',
            accessor: (row) => `${row.client.user.first_name} ${row.client.user.last_name}`
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Clientes',
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => row.client.user.address
        },
        {
            id: 'total_amount',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => getSaleTotal(row)
        },
    ]

    return (
        <Layout title="Presupuestos">
            <DataGridWithBackendPagination
                headCells={headCells}
                loading={loadingBudgets || disabled}
                rows={state.budgets.data}
                entityKey="budgets"
                getter={getBudgets}
                setOpen={setOpen}
                setFormData={setFormData}
                showPDFAction
                showViewAction
                showEditAction
                showDeleteAction
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
                                PDF
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
                        setBudgetProducts([])
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
                                    <AddProductsToBudget
                                        products={state.products.data}
                                        budgetProducts={budgetProducts}
                                        setBudgetProducts={setBudgetProducts}
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
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <FormControl>
                                    <InputLabel htmlFor="subtotal">Subtotal</InputLabel>
                                    <Input value={getCurrentSubtotal(budgetProducts, state.products.data)} id="subtotal" type="number" name="subtotal" disabled />
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="total">Total</InputLabel>
                                    <Input value={0} id="total" type="number" name="total" disabled />
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
                                setBudgetProducts([])
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
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de presupuesto
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