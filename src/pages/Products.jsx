import { useContext, useEffect } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useProducts } from '../hooks/useProducts'
import { useSuppliers } from "../hooks/useSuppliers";
import { useForm } from "../hooks/useForm";
import { useMovements } from "../hooks/useMovements";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ProductFilter } from "../components/filters/ProductFilter";
import { MovementsForm } from "../components/commercial/MovementsForm";

import { getNewPrice, getStock } from "../utils/helpers";
import { REPORT_URL } from "../utils/urls";

export function Products() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        loadingProducts,
        setEarnPrice,
        open,
        setOpen,
        handleSubmit,
        massiveEdit,
        earnPrice,
        massiveEditPercentage,
        setMassiveEdit,
        setMassiveEditPercentage,
        handleSubmitMassive,
        handleDelete,
        getProducts
    } = useProducts()
    const { loadingSuppliers, getSuppliers } = useSuppliers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            supplier_id: '',
            cash: true,
            cta_cte: true,
            poxipol: false,
            amount: ''
        },
        rules: {
            code: { required: true, maxLength: 55 },
            details: { required: true, maxLength: 55 },
            buy_price: { required: true },
            min_stock: { required: true },
            earn: { required: true },
            supplier_id: { required: true },
            amount: { required: open === 'NEW' }
        }
    })
    const {
        open: openMovement,
        setOpen: setOpenMovement,
        handleSubmit: handleSubmitMovement
    } = useMovements()
    const {
        formData: formDataMovement,
        setFormData: setFormDataMovement,
        handleChange: handleChangeMovement,
        errors: errorsMovement,
        disabled: disabledMovement,
        setDisabled: setDisabledMovement,
        reset: resetMovement,
        validate: validateMovement
    } = useForm({
        defaultData: { amount: '', observations: '' },
        rules: { amount: { required: true }, observations: { maxLength: 255 } }
    })

    useEffect(() => {
        getSuppliers()
    }, [])

    useEffect(() => {
        const buy_price = formData.buy_price.toString().length === 0 ? 0 : parseInt(formData.buy_price)
        const earn = formData.earn.toString().length === 0 ? 0 : parseInt(formData.earn)
        setEarnPrice(`$${(buy_price + ((buy_price / 100) * earn)).toFixed(2)}`)
    }, [formData])

    const headCells = [
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code',
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Producto',
            accessor: 'details',
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'buy_price',
            numeric: false,
            disablePadding: true,
            label: 'P. compra',
            accessor: 'buy_price'
        },
        {
            id: 'earn',
            numeric: false,
            disablePadding: true,
            label: '% Gan.',
            accessor: 'earn'
        },
        {
            id: 'sale_price',
            numeric: false,
            disablePadding: true,
            label: 'P. venta',
            sorter: (row) => parseFloat((row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)),
            accessor: (row) => `$${(row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)}`,
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name,
            can_access: ['CHOFER', 'VENDEDOR']
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock',
            sorter: (row) => getStock(row),
            accessor: (row) => getStock(row),
            can_access: ['VENDEDOR']
        },
        {
            id: 'min_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock mínimo',
            accessor: 'min_stock'
        }
    ]

    return (
        <Layout title="Productos">
            <DataGridWithBackendPagination
                headCells={headCells.filter(hc => auth?.user.role === 'ADMINISTRADOR' || hc.can_access?.includes(auth?.user.role))}
                rows={state.products.data}
                setOpen={setOpen}
                setOpenNewMovement={setOpenMovement}
                setFormData={setFormData}
                setFormDataMovement={setFormDataMovement}
                entityKey="products"
                getter={getProducts}
                loading={loadingSuppliers || loadingProducts || disabled}
                deadlineColor="products"
                showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
                showEditAction={auth?.user.role === 'ADMINISTRADOR'}
                showInput={auth?.user.role === 'ADMINISTRADOR' && "Ingresar stock"}
                showOutput={auth?.user.role === 'ADMINISTRADOR' && "Egresar stock"}
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', gap: 1, marginBottom: { xs: 2, lg: 0 } }}>
                            {auth?.user.role === 'ADMINISTRADOR' &&
                                <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                    Agregar
                                </Button>
                            }
                            <Button variant="outlined" color='success' onClick={() => {
                                window.open(`${REPORT_URL}/products-excel?token=${auth?.token}`, '_blank')
                            }}>
                                Excel
                            </Button>
                            <Button variant="outlined" color='error' onClick={() => {
                                window.open(`${REPORT_URL}/products-pdf?token=${auth?.token}`, '_blank')
                            }}>
                                PDF
                            </Button>
                            {auth?.user.role !== 'CHOFER' &&
                                <Button variant="contained" onClick={() => {
                                    window.open(`${REPORT_URL}/products-pdf?token=${auth?.token}&stock=SIN_STOCK`, '_blank')
                                }}>
                                    Stock nulo
                                </Button>
                            }
                        </Box>
                        <ProductFilter />
                    </Box>
                }
            >
                <ModalComponent
                    open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'}
                    onClose={() => reset(setOpen)}
                    reduceWidth={500}
                >
                    <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                        {open === 'NEW' && 'Nuevo producto'}
                        {open === 'EDIT' && 'Editar producto'}
                        {open === 'VIEW' && `Producto #${formData.id}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="code">Código *</InputLabel>
                                    <Input id="code" type="text" name="code" value={formData.code} disabled={open === 'VIEW'} />
                                    {errors.code?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El código es requerido.
                                        </Typography>
                                    }
                                    {errors.code?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El código es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="details">Nombre producto *</InputLabel>
                                    <Input id="details" type="text" name="details" value={formData.details} disabled={open === 'VIEW'} />
                                    {errors.details?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es requerido.
                                        </Typography>
                                    }
                                    {errors.details?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="buy_price">Precio de compra *</InputLabel>
                                    <Input id="buy_price" type="number" name="buy_price" value={formData.buy_price} disabled={open === 'VIEW'} />
                                    {errors.buy_price?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El precio de compra es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="earn">% Ganancia *</InputLabel>
                                    <Input id="earn" type="number" name="earn" value={formData.earn} disabled={open === 'VIEW'} />
                                    {errors.earn?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La ganancia es requerida.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="size">Precio de venta</InputLabel>
                                    <Input
                                        type="text"
                                        value={earnPrice}
                                        disabled
                                    />
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="min_stock">Stock mínimo *</InputLabel>
                                    <Input id="min_stock" type="number" name="min_stock" value={formData.min_stock} disabled={open === 'VIEW'} />
                                    {errors.min_stock?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El stock mínimo es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel id="supplier-select">Proveedor *</InputLabel>
                                    <Select
                                        labelId="supplier-select"
                                        id="supplier_id"
                                        value={formData.supplier_id}
                                        label="Proveedor"
                                        name="supplier_id"
                                        onChange={handleChange}
                                        disabled={open === 'VIEW'}
                                    >
                                        {state.suppliers.data.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.supplier_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El proveedor es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Efectivo"
                                        checked={formData.cash}
                                        disabled={open === 'VIEW'}
                                        onChange={e => handleChange({
                                            target: {
                                                name: 'cash',
                                                value: e.target.checked
                                            }
                                        })}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Cta. Cte."
                                        checked={formData.cta_cte}
                                        disabled={open === 'VIEW'}
                                        onChange={e => handleChange({
                                            target: {
                                                name: 'cta_cte',
                                                value: e.target.checked
                                            }
                                        })}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Poxipol"
                                        checked={formData.poxipol}
                                        disabled={open === 'VIEW'}
                                        onChange={e => handleChange({
                                            target: {
                                                name: 'poxipol',
                                                value: e.target.checked
                                            }
                                        })}
                                    />
                                </Box>
                            </Box>
                            {open === 'NEW' &&
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="amount">Stock *</InputLabel>
                                    <Input id="amount" type="number" name="amount" value={formData.amount} disabled={open === 'VIEW'} />
                                    {errors.amount?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El stock es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                            }
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
                                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                                </Button>
                                {(open === 'NEW' || open === 'EDIT') &&
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Confirmar
                                    </Button>
                                }
                            </FormControl>
                        </Box>
                    </form>
                </ModalComponent>
                <ModalComponent open={open === 'MASSIVE-EDIT'} dynamicContent>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Actualización de precio/s por porcentaje
                    </Typography>
                    <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Producto</TableCell>
                                    <TableCell align="center">Código</TableCell>
                                    <TableCell align="center">Proveedor</TableCell>
                                    <TableCell align="center">Precio actual</TableCell>
                                    <TableCell align="center">Precio nuevo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {massiveEdit.map(me => (
                                    <TableRow
                                        key={me.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{me.details}</TableCell>
                                        <TableCell align="center">{me.code}</TableCell>
                                        <TableCell align="center">{me.supplier.name}</TableCell>
                                        <TableCell align="center">${me.buy_price.toFixed(2)}</TableCell>
                                        <TableCell align="center">${getNewPrice(me, massiveEditPercentage)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        marginTop: 5,
                        marginBottom: 5
                    }}>
                        <Typography variant="h6">
                            Porcentaje
                        </Typography>
                        <Input
                            type="number"
                            value={massiveEditPercentage}
                            onChange={e => setMassiveEditPercentage(e.target.value)}
                        />
                        <Typography variant="h6">
                            %
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        width: '60%',
                        margin: '0 auto'
                    }}>
                        <Button type="button" variant="outlined"
                            sx={{ width: '50%' }}
                            onClick={() => {
                                reset(setOpen)
                                setMassiveEdit([])
                                setMassiveEditPercentage(0)
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained"
                            sx={{ width: '50%' }}
                            onClick={() => handleSubmitMassive(reset, setDisabled)}
                        >
                            Guardar
                        </Button>
                    </Box>
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de producto
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
                <MovementsForm
                    open={openMovement}
                    setOpen={setOpenMovement}
                    formData={formDataMovement}
                    errors={errorsMovement}
                    handleChange={handleChangeMovement}
                    reset={resetMovement}
                    disabled={disabledMovement}
                    setDisabled={setDisabledMovement}
                    handleSubmit={handleSubmitMovement}
                    validate={validateMovement}
                />
            </DataGridWithBackendPagination>
        </Layout>
    )
}