import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { format } from 'date-fns'

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useProducts } from "../hooks/useProducts";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { INCOME_URL } from "../utils/urls";

export function Incomes() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { get, post, put, destroy } = useApi(INCOME_URL)

    const { products, loadingProducts } = useProducts()
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

    const [loadingIncomes, setLoadingIncomes] = useState(true)
    const [incomes, setIncomes] = useState([])
    const [open, setOpen] = useState(null)

    useEffect(() => {
        if (auth?.user.role.name !== 'ADMINISTRADOR') navigate('/veroshop/productos')
    }, [])

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setIncomes(data)
                setLoadingIncomes(false)
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setIncomes([data, ...incomes])
                    setMessage('Ingreso creado correctamente.')
                } else {
                    setIncomes([data, ...incomes.filter(inc => inc.id !== formData.id)])
                    setMessage('Ingreso editado correctamente.')
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
        setLoadingIncomes(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setIncomes([...incomes.filter(inc => !ids.includes(inc.id))])
            setMessage(`${result.length === 1 ? 'Ingreso eliminado' : 'Ingresos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingIncomes(false)
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
            id: 'product',
            numeric: false,
            disablePadding: true,
            label: 'Producto',
            accessor: (row) => `${row.product.name} (${row.product.code})`
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
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
        <Layout title="Ingresos">
            {loadingIncomes || loadingProducts || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Ingresos registrados"
                    headCells={headCells}
                    rows={incomes}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {open === 'NEW' && 'Nuevo ingreso'}
                            {open === 'EDIT' && 'Editar ingreso'}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl>
                                    <InputLabel id="product-select">Producto</InputLabel>
                                    <Select
                                        labelId="product-select"
                                        id="product_id"
                                        value={formData.product_id}
                                        label="Producto"
                                        name="product_id"
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
                                    <InputLabel htmlFor="amount">Cantidad</InputLabel>
                                    <Input id="amount" type="number" name="amount" value={formData.amount} />
                                    {errors.amount?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La cantidad es requerida.
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