import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useProducts } from '../hooks/useProducts'
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";
import { useApi } from "../hooks/useApi";

import { AuthContext } from "../providers/AuthProvider";
import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { ProductFilter } from "../components/filters/ProductFilter";

import { PRODUCT_URL } from "../utils/urls";
import { getNewPrice, getStock } from "../utils/helpers";

export function Products() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, putMassive, destroy } = useApi(PRODUCT_URL)
    const { products, setProducts, loadingProducts, setLoadingProducts, getProducts } = useProducts()
    const { suppliers, loadingSuppliers } = useSuppliers()
    const [open, setOpen] = useState(null)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            size: '',
            supplier_id: '',
            amount: '',
            observations: ''
        },
        rules: {
            code: {
                required: true,
                maxLength: 55
            },
            details: {
                required: true,
                maxLength: 55
            },
            buy_price: {
                required: true
            },
            min_stock: {
                required: true
            },
            earn: {
                required: true
            },
            size: {
                maxLength: 55,
                required: true
            },
            supplier_id: {
                required: true
            },
            amount: {
                required: open === 'NEW'
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [massiveEdit, setMassiveEdit] = useState([])
    const [massiveEditPercentage, setMassiveEditPercentage] = useState(0)
    const [earnPrice, setEarnPrice] = useState(0)

    useEffect(() => {
        const buy_price = formData.buy_price.toString().length === 0 ? 0 : parseInt(formData.buy_price)
        const earn = formData.earn.toString().length === 0 ? 0 : parseInt(formData.earn)
        setEarnPrice(`$${(buy_price + ((buy_price / 100) * earn)).toFixed(2)}`)
    }, [formData])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setProducts([data, ...products])
                    setMessage('Producto creado correctamente.')
                } else {
                    setProducts([data, ...products.filter(p => p.id !== formData.id)])
                    setMessage('Producto editado correctamente.')
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

    async function handleSubmitMassive() {
        setLoadingProducts(true)
        const body = {
            products: massiveEdit.map(me => ({ id: me.id, buy_price: me.buy_price })),
            percentage: parseInt(massiveEditPercentage)
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            setProducts([...data, ...products.filter(p => !data.map(d => d.id).includes(p.id))])
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            reset(setOpen)
            setMassiveEdit([])
            setMassiveEditPercentage(0)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setLoadingProducts(false)
        setOpenMessage(true)
    }

    async function handleDelete(elements) {
        setLoadingProducts(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setProducts([...products.filter(p => !ids.includes(p.id))])
            setMessage(`${result.length === 1 ? 'Producto eliminado' : 'Productos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen productos con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingProducts(false)
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
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code'
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Detalle',
            accessor: 'details'
        },
        {
            id: 'size',
            numeric: false,
            disablePadding: true,
            label: 'Talle',
            sorter: (row) => row.size.toLowerCase(),
            accessor: 'size'
        },
        {
            id: 'buy_price',
            numeric: false,
            disablePadding: true,
            label: 'Precio de compra',
            accessor: (row) => `$${row.buy_price.toFixed(2)}`
        },
        {
            id: 'earn',
            numeric: false,
            disablePadding: true,
            label: 'Ganancia',
            accessor: (row) => `${row.earn}%`
        },
        {
            id: 'sale_price',
            numeric: false,
            disablePadding: true,
            label: 'Precio de venta',
            sorter: (row) => parseFloat((row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)),
            accessor: (row) => `$${(row.buy_price + ((row.buy_price / 100) * row.earn)).toFixed(2)}`
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name
        },
        {
            id: 'min_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock mínimo',
            accessor: 'min_stock'
        },
        {
            id: 'stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock actual',
            sorter: (row) => getStock(row),
            accessor: (row) => getStock(row)
        }
    ]

    return (
        <Layout title="Productos">
            {loadingProducts || loadingSuppliers || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <ProductFilter
                        products={products}
                        setProducts={setProducts}
                        suppliers={suppliers}
                    />
                    <DataGrid
                        title="Inventario"
                        headCells={headCells}
                        rows={products}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                        disableSelection={auth?.user.role.name !== 'ADMINISTRADOR'}
                        disableAdd={auth?.user.role.name !== 'ADMINISTRADOR'}
                        allowMassiveEdit
                        updateByPercentage
                        setMassiveEdit={setMassiveEdit}
                        deadlineColor="products"
                        handlePrint
                        pageKey="products"
                        getter={getProducts}
                    >
                        <ModalComponent
                            open={open === 'NEW' || open === 'EDIT'}
                            onClose={() => reset(setOpen)}
                        >
                            <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                                {open === 'NEW' && 'Nuevo producto'}
                                {open === 'EDIT' && 'Editar producto'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                            <FormControl>
                                                <InputLabel htmlFor="code">Código</InputLabel>
                                                <Input id="code" type="text" name="code" value={formData.code} />
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
                                            <FormControl>
                                                <InputLabel htmlFor="details">Detalle</InputLabel>
                                                <Input id="details" type="text" name="details" value={formData.details} />
                                                {errors.details?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El detalle es requerido.
                                                    </Typography>
                                                }
                                                {errors.details?.type === 'maxLength' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El detalle es demasiado largo.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="buy_price">Precio de compra</InputLabel>
                                                <Input id="buy_price" type="number" name="buy_price" value={formData.buy_price} />
                                                {errors.buy_price?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El precio de compra es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="earn">% Ganancia</InputLabel>
                                                <Input id="earn" type="number" name="earn" value={formData.earn} />
                                                {errors.earn?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * La ganancia es requerida.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel htmlFor="size">Precio de venta</InputLabel>
                                                <Input
                                                    type="text"
                                                    value={earnPrice}
                                                    disabled
                                                />
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                            <FormControl>
                                                <InputLabel htmlFor="size">Talle</InputLabel>
                                                <Input id="size" type="text" name="size" value={formData.size} />
                                                {errors.size?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El talle es requerido.
                                                    </Typography>
                                                }
                                                {errors.size?.type === 'maxLength' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El talle es demasiado largo.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel id="supplier-select">Proveedor</InputLabel>
                                                <Select
                                                    labelId="supplier-select"
                                                    id="supplier_id"
                                                    value={formData.supplier_id}
                                                    label="Proveedor"
                                                    name="supplier_id"
                                                    onChange={handleChange}
                                                >
                                                    {suppliers.map(s => (
                                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.supplier_id?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El proveedor es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            {open === 'NEW' &&
                                                <FormControl>
                                                    <InputLabel htmlFor="amount">Stock inicial</InputLabel>
                                                    <Input id="amount" type="number" name="amount" value={formData.amount} />
                                                    {errors.amount?.type === 'required' &&
                                                        <Typography variant="caption" color="red" marginTop={1}>
                                                            * La cantidad es requerida.
                                                        </Typography>
                                                    }
                                                </FormControl>
                                            }
                                            <FormControl>
                                                <InputLabel htmlFor="min_stock">Stock mínimo</InputLabel>
                                                <Input id="min_stock" type="number" name="min_stock" value={formData.min_stock} />
                                                {errors.min_stock?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El stock mínimo es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            {open === 'NEW' &&
                                                <FormControl>
                                                    <InputLabel htmlFor="observations">Observaciones de ingreso</InputLabel>
                                                    <Input id="observations" type="text" name="observations" value={formData.observations} />
                                                    {errors.observations?.type === 'maxLength' &&
                                                        <Typography variant="caption" color="red" marginTop={1}>
                                                            * Las observaciones son demasiado largas.
                                                        </Typography>
                                                    }
                                                </FormControl>
                                            }
                                        </Box>
                                    </Box>
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
                                    onClick={handleSubmitMassive}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </ModalComponent>
                    </DataGrid>
                </>
            }
        </Layout>
    )
}