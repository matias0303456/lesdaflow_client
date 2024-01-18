import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useProducts } from "../hooks/useProducts";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { SALE_URL } from "../utils/urls";
import { getStock } from "../utils/helpers";

export function Outcomes() {

    const { get, post, put, destroy } = useApi(SALE_URL)

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { products, loadingProducts } = useProducts(true)
    const { clients, loadingClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            article_id: '',
            client_id: '',
            amount: '',
            discount: '',
            observations: ''
        },
        rules: {
            article_id: {
                required: true
            },
            client_id: {
                required: true
            },
            amount: {
                required: true
            },
            discount: {
                required: true
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [loadingOutcomes, setLoadingOutcomes] = useState(true)
    const [outcomes, setOutcomes] = useState([])
    const [open, setOpen] = useState(null)
    const [hasStock, setHasStock] = useState(false)

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setOutcomes(data)
                setLoadingOutcomes(false)
            }
        })()
    }, [])

    useEffect(() => {
        setHasStock(getStock(products.find(p => p.id === formData.product_id)) >= parseInt(formData.amount) && formData.amount.toString().length > 0)
    }, [formData])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!hasStock) {
            setMessage('No hay stock disponible.')
            setSeverity('error')
            setOpenMessage(true)
            return
        }
        if (validate() && hasStock) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setOutcomes([data, ...outcomes])
                    setMessage('Egreso creado correctamente.')
                } else {
                    setOutcomes([data, ...outcomes.filter(out => out.id !== formData.id)])
                    setMessage('Egreso editado correctamente.')
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
        setLoadingOutcomes(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setOutcomes([...outcomes.filter(out => !ids.includes(out.id))])
            setMessage(`${result.length === 1 ? 'Egreso eliminado' : 'Egresos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingOutcomes(false)
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
            id: 'article',
            numeric: false,
            disablePadding: true,
            label: 'Artículo',
            accessor: (row) => `${row.article.name} (${row.article.code})`
        },
        {
            id: 'client',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            accessor: (row) => row.client.name
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio unitario',
            accessor: (row) => row.article.sale_price
        },
        {
            id: 'discount',
            numeric: false,
            disablePadding: true,
            label: '% Descuento',
            accessor: 'discount'
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => (row.article.sale_price * row.amount) - (((row.article.sale_price * row.amount) / 100) * row.discount)
        },
        {
            id: 'currency',
            numeric: false,
            disablePadding: true,
            label: 'Moneda',
            accessor: (row) => row.article.currency.iso
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Observaciones',
            accessor: 'observations'
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.created_at), 'dd-MM-yyyy')
        }
    ]

    return (
        <Layout title="Egresos">
            {loadingClients || loadingOutcomes || loadingProducts || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Egresos registrados"
                    headCells={headCells}
                    rows={outcomes}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nuevo egreso'}
                            {open === 'EDIT' && 'Editar egreso'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl>
                                    <InputLabel id="article-select">Producto</InputLabel>
                                    <Select
                                        labelId="article-select"
                                        id="product_id"
                                        value={formData.article_id}
                                        label="Producto"
                                        name="article_id"
                                        onChange={handleChange}
                                    >
                                        {products.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.product_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El producto es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="client-select">Cliente</InputLabel>
                                    <Select
                                        labelId="client-select"
                                        id="client_id"
                                        value={formData.client_id}
                                        label="Cliente"
                                        name="client_id"
                                        onChange={handleChange}
                                    >
                                        {clients.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.client_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El cliente es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="amount">Cantidad</InputLabel>
                                    <Input id="amount" type="number" name="amount" value={formData.amount} />
                                    {errors.amount?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La cantidad es requerida.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="discount">Descuento</InputLabel>
                                    <Input id="discount" type="number" name="discount" value={formData.discount} />
                                    {errors.discount?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El descuento es requerido.
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