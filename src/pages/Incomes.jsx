import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { format } from 'date-fns'

import { AuthContext } from "../providers/AuthProvider";
import { SearchContext } from "../providers/SearchProvider";
import { useForm } from "../hooks/useForm";
import { useMovements } from "../hooks/useMovements";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { MovementFilter } from "../components/filters/MovementFilter";

import { getStockTillDate } from "../utils/helpers";

export function Incomes() {

    const { auth } = useContext(AuthContext)
    const { searchProducts } = useContext(SearchContext)

    const navigate = useNavigate()

    const {
        incomes,
        getIncomes,
        loadingIncomes,
        setOpenIncome,
        handleDeleteIncome,
        handleSubmitIncome,
        openIncome,
        oldFormDataAmount,
        setOldFormDataAmount
    } = useMovements()
    const { getSearchProducts } = useProducts()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            product_id: '',
            amount: '',
            observations: ''
        },
        rules: {
            product_id: {
                required: true
            },
            amount: {
                required: true
            },
            observations: {
                maxLength: 55
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role.name !== 'ADMINISTRADOR') navigate('/veroshop/productos')
    }, [])

    useEffect(() => {
        getIncomes()
        getSearchProducts()
    }, [])

    useEffect(() => {
        if (openIncome === 'NEW') setOldFormDataAmount(0)
        if (openIncome === 'EDIT') setOldFormDataAmount(parseInt(formData.amount))
    }, [openIncome])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'product_code',
            numeric: false,
            disablePadding: true,
            label: 'Cód. Producto',
            sorter: (row) => row.product.code,
            accessor: (row) => row.product.code
        },
        {
            id: 'product_details',
            numeric: false,
            disablePadding: true,
            label: 'Det. Producto',
            sorter: (row) => row.product.details.toLowerCase(),
            accessor: (row) => row.product.details
        },
        {
            id: 'product_size',
            numeric: false,
            disablePadding: true,
            label: 'Talle Producto',
            sorter: (row) => row.product.size.toLowerCase(),
            accessor: (row) => row.product.size
        },
        {
            id: 'old_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock anterior',
            sorter: (row) => getStockTillDate(row),
            accessor: (row) => getStockTillDate(row)
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
        },
        {
            id: 'new_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock posterior',
            sorter: (row) => getStockTillDate(row) + row.amount,
            accessor: (row) => getStockTillDate(row) + row.amount
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            sorter: (row) => row.observations ?? '',
            accessor: 'observations'
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.created_at), 'dd/MM/yy')
        }
    ]

    return (
        <Layout title="Ingresos">
            {loadingIncomes || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <MovementFilter entityKey="incomes" getter={getIncomes} />
                    <DataGrid
                        title=""
                        headCells={headCells}
                        rows={incomes}
                        open={openIncome}
                        setOpen={setOpenIncome}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDeleteIncome}
                        pageKey="incomes"
                        getter={getIncomes}
                    >
                        <ModalComponent open={openIncome === 'NEW' || openIncome === 'EDIT'} onClose={() => reset(setOpenIncome)} reduceWidth={600}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {openIncome === 'NEW' && 'Nuevo ingreso'}
                                {openIncome === 'EDIT' && 'Editar ingreso'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={e => handleSubmitIncome(e, formData, validate, reset, setDisabled)}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl>
                                        <Autocomplete
                                            disablePortal
                                            id="product-autocomplete"
                                            value={formData.product_id.toString() > 0 ? `Cód: ${searchProducts.find(p => p.id === formData.product_id)?.code} - Det: ${searchProducts.find(p => p.id === formData.product_id)?.details} - T: ${searchProducts.find(p => p.id === formData.product_id)?.size}` : ''}
                                            options={searchProducts.map(p => ({ label: `Cód: ${p.code} - Det: ${p.details} - T: ${p.size}`, id: p.id }))}
                                            noOptionsText="No hay productos registrados."
                                            onChange={(e, value) => handleChange({ target: { name: 'product_id', value: value?.id ?? '' } })}
                                            renderInput={(params) => <TextField {...params} label="Producto" />}
                                            isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                        />
                                        {errors.product_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El producto es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">
                                                            Stock actual
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            Cantidad
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            Nuevo stock
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="center">
                                                            {formData.product_id.toString().length > 0 ? searchProducts.find(p => p.id === formData.product_id)?.stock : 0}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <FormControl>
                                                                <Input id="amount" type="number" name="amount" value={formData.amount} />
                                                                {errors.amount?.type === 'required' &&
                                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                                        * La cantidad es requerida.
                                                                    </Typography>
                                                                }
                                                            </FormControl>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {formData.product_id.toString().length > 0 ? searchProducts.find(p => p.id === formData.product_id)?.stock + Math.abs(parseInt(formData.amount.toString().length > 0 ? formData.amount : 0)) - oldFormDataAmount : 0}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <FormControl>
                                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                        <Input id="observations" type="text" name="observations" value={formData.observations} />
                                        {errors.observations?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las observaciones son demasiado largas.
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
                                        <Button type="button" variant="outlined" onClick={() => reset(setOpenIncome)} sx={{
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