import { useContext, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useArticles } from '../hooks/useArticles'
import { useCategories } from "../hooks/useCategories";
import { useForm } from "../hooks/useForm";
import { useCurrencies } from '../hooks/useCurrencies'
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { ARTICLE_URL } from "../utils/urls";
import { useApi } from "../hooks/useApi";

export function Articles() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy } = useApi(ARTICLE_URL)
    const { articles, setArticles, loadingArticles, setLoadingArticles } = useArticles()
    const { currencies, loadingCurrencies } = useCurrencies()
    const { categories, loadingCategories } = useCategories()
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
                    setArticles([data, ...articles])
                    setMessage('Artículo creado correctamente.')
                } else {
                    setArticles([data, ...articles.filter(art => art.id !== formData.id)])
                    setMessage('Artículo editado correctamente.')
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
        setLoadingArticles(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setArticles([...articles.filter(art => !ids.includes(art.id))])
            setMessage(`${result.length === 1 ? 'Artículo eliminado' : 'Articulos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingArticles(false)
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
        },
        {
            id: 'category',
            numeric: false,
            disablePadding: true,
            label: 'Categoría',
            accessor: (row) => row.category.name
        }
    ]

    return (
        <Layout title="Artículos">
            {loadingArticles || loadingCategories || loadingCurrencies || loadingSuppliers || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Artículos registrados"
                    headCells={headCells}
                    rows={articles}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                            {open === 'NEW' && 'Nuevo artículo'}
                            {open === 'EDIT' && 'Editar artículo'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                    <InputLabel htmlFor="purchase_price">Precio de compra</InputLabel>
                                    <Input id="purchase_price" type="number" name="purchase_price" value={formData.purchase_price} />
                                    {errors.purchase_price?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El precio de compra es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="sale_price">Precio de venta</InputLabel>
                                    <Input id="sale_price" type="number" name="sale_price" value={formData.sale_price} />
                                    {errors.sale_price?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El precio de venta es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="currency-select">Moneda</InputLabel>
                                    <Select
                                        labelId="currency-select"
                                        id="currency_id"
                                        value={formData.currency_id}
                                        label="Moneda"
                                        name="currency_id"
                                        onChange={handleChange}
                                    >
                                        {currencies.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.iso}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.currency_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La moneda es requerida.
                                        </Typography>
                                    }
                                </FormControl>
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
                                <FormControl>
                                    <InputLabel id="category-select">Categoría</InputLabel>
                                    <Select
                                        labelId="category-select"
                                        id="category_id"
                                        value={formData.category_id}
                                        label="Categoría"
                                        name="category_id"
                                        onChange={handleChange}
                                    >
                                        {categories.map(cat => (
                                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La categoría es requerida.
                                        </Typography>
                                    }
                                </FormControl>
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