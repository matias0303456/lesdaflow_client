import { useContext, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useProducts } from '../hooks/useProducts'
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { PRODUCT_URL } from "../utils/urls";
import { useApi } from "../hooks/useApi";

export function Articles() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(PRODUCT_URL)
    const { products, setProducts, loadingProducts, setLoadingProducts } = useProducts()
    const { suppliers, loadingSuppliers } = useSuppliers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            code: '',
            purchase_price: '',
            sale_price: '',
            currency_id: '',
            supplier_id: '',
            details: '',
            category_id: ''
        },
        rules: {
            name: {
                required: true,
                maxLength: 55
            },
            code: {
                required: true,
                maxLength: 55
            },
            purchase_price: {
                required: true
            },
            sale_price: {
                required: true
            },
            currency_id: {
                required: true
            },
            supplier_id: {
                required: true
            },
            details: {
                maxLength: 55
            },
            category_id: {
                required: true
            }
        }
    })

    const [open, setOpen] = useState(null)

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

    async function handleDelete(elements) {
        setLoadingProducts(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setProducts([...products.filter(p => !ids.includes(p.id))])
            setMessage(`${result.length === 1 ? 'Producto eliminado' : 'Productos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
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
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
        {
            id: 'code',
            numeric: false,
            disablePadding: true,
            label: 'Código',
            accessor: 'code'
        },
        {
            id: 'purchase_price',
            numeric: true,
            disablePadding: true,
            label: 'Precio de compra',
            accessor: 'purchase_price'
        },
        {
            id: 'sale_price',
            numeric: true,
            disablePadding: true,
            label: 'Precio de venta',
            accessor: 'sale_price'
        },
        {
            id: 'currency',
            numeric: true,
            disablePadding: true,
            label: 'Moneda',
            accessor: (row) => row.currency.iso
        },
        {
            id: 'details',
            numeric: false,
            disablePadding: true,
            label: 'Detalle',
            accessor: 'details'
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: (row) => row.supplier.name
        }
    ]

    return (
        <Layout title="Productos">
            {loadingProducts || loadingSuppliers || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Productos registrados"
                    headCells={headCells}
                    rows={products}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent
                        open={open === 'NEW' || open === 'EDIT'}
                        onClose={() => reset(setOpen)}
                        width={800}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                            {open === 'NEW' && 'Nuevo artículo'}
                            {open === 'EDIT' && 'Editar artículo'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                        <FormControl>
                                            <InputLabel htmlFor="name">Nombre</InputLabel>
                                            <Input id="name" type="text" name="name" value={formData.name} />
                                            {errors.name?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre es requerido.
                                                </Typography>
                                            }
                                            {errors.name?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El nombre es demasiado largo.
                                                </Typography>
                                            }
                                        </FormControl>
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
                                            <InputLabel htmlFor="price">Precio</InputLabel>
                                            <Input id="price" type="number" name="price" value={formData.price} />
                                            {errors.price?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El precio es requerido.
                                                </Typography>
                                            }
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', gap: 3 }}>
                                        <FormControl>
                                            <InputLabel htmlFor="details">Detalle</InputLabel>
                                            <Input id="details" type="text" name="details" value={formData.details} />
                                            {errors.details?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El detalle es demasiado largo.
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
                                    </Box>
                                </Box>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'center',
                                    marginTop: 1
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
                </DataGrid>
            }
        </Layout>
    )
}