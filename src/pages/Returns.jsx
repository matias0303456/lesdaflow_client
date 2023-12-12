import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { format } from "date-fns";

import { MessageContext } from "../providers/MessageProvider";
import { useForm } from "../hooks/useForm";
import { useArticles } from '../hooks/useArticles'
import { useClients } from "../hooks/useClients";
import { useSuppliers } from "../hooks/useSuppliers";
import { useApi } from "../hooks/useApi";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { CLIENT_RETURN_URL, SUPPLIER_RETURN_URL } from "../utils/urls";
import { getStock } from "../utils/helpers";

export function Returns() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const {
        get: getClientReturns,
        post: postClientReturn,
        put: putClientReturn,
        destroy: destroyClientReturn
    } = useApi(CLIENT_RETURN_URL)
    const {
        get: getSupplierReturns,
        post: postSupplierReturn,
        put: putSupplierReturn,
        destroy: destroySupplierReturn
    } = useApi(SUPPLIER_RETURN_URL)
    const { articles, loadingArticles } = useArticles(true)
    const { clients, loadingClients } = useClients()
    const { suppliers, loadingSuppliers } = useSuppliers()
    const {
        formData: formDataClient,
        setFormData: setFormDataClient,
        handleChange: handleChangeClient,
        disabled: disabledClient,
        setDisabled: setDisabledClient,
        validate: validateClient,
        reset: resetClient,
        errors: errorsClient
    } = useForm({
        defaultData: {
            id: '',
            article_id: '',
            client_id: '',
            amount: '',
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
            observations: {
                maxLength: 55
            }
        }
    })
    const {
        formData: formDataSupplier,
        setFormData: setFormDataSupplier,
        handleChange: handleChangeSupplier,
        disabled: disabledSupplier,
        setDisabled: setDisabledSupplier,
        validate: validateSupplier,
        reset: resetSupplier,
        errors: errorsSupplier
    } = useForm({
        defaultData: {
            id: '',
            article_id: '',
            supplier_id: '',
            amount: '',
            observations: ''
        },
        rules: {
            article_id: {
                required: true
            },
            supplier_id: {
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

    const [openClient, setOpenClient] = useState(null)
    const [openSupplier, setOpenSupplier] = useState(null)
    const [loadingClientReturns, setLoadingClientReturns] = useState(true)
    const [loadingSupplierReturns, setLoadingSupplierReturns] = useState(true)
    const [clientReturns, setClientReturns] = useState([])
    const [supplierReturns, setSupplierReturns] = useState([])
    const [hasStock, setHasStock] = useState(false)

    useEffect(() => {
        (async () => {
            const { status, data } = await getClientReturns()
            if (status === 200) {
                setClientReturns(data)
                setLoadingClientReturns(false)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const { status, data } = await getSupplierReturns()
            if (status === 200) {
                setSupplierReturns(data)
                setLoadingSupplierReturns(false)
            }
        })()
    }, [])

    useEffect(() => {
        setHasStock(getStock(articles.find(art => art.id === formDataSupplier.article_id)) >= parseInt(formDataSupplier.amount) && formDataSupplier.amount.toString().length > 0)
    }, [formDataSupplier])

    async function handleSubmitClient(e) {
        e.preventDefault()
        console.log(formDataClient)
        if (validateClient()) {
            const { status, data } = openClient === 'NEW' ? await postClientReturn(formDataClient) : await putClientReturn(formDataClient)
            if (status === 200) {
                if (openClient === 'NEW') {
                    setClientReturns([data, ...clientReturns])
                    setMessage('Registro de devolución creado correctamente.')
                } else {
                    setClientReturns([data, ...clientReturns.filter(cr => cr.id !== formDataClient.id)])
                    setMessage('Registro de devolución editado correctamente.')
                }
                setSeverity('success')
                resetClient(setOpenClient)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabledClient(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDeleteClient(elements) {
        setLoadingClientReturns(true)
        const result = await Promise.all(elements.map(e => destroyClientReturn(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setClientReturns([...clientReturns.filter(cr => !ids.includes(cr.id))])
            setMessage(`${result.length === 1 ? 'Registro eliminado' : 'Registros eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingClientReturns(false)
        setOpenClient(null)
    }

    async function handleSubmitSupplier(e) {
        e.preventDefault()
        if (!hasStock) {
            setMessage('No hay stock disponible.')
            setSeverity('error')
            setOpenMessage(true)
            return
        }
        if (validateSupplier() && hasStock) {
            const { status, data } = openSupplier === 'NEW' ? await postSupplierReturn(formDataSupplier) : await putSupplierReturn(formDataSupplier)
            if (status === 200) {
                if (openSupplier === 'NEW') {
                    setSupplierReturns([data, ...supplierReturns])
                    setMessage('Registro de devolución creado correctamente.')
                } else {
                    setSupplierReturns([data, ...supplierReturns.filter(sr => sr.id !== formDataSupplier.id)])
                    setMessage('Registro de devolución editado correctamente.')
                }
                setSeverity('success')
                resetSupplier(setOpenSupplier)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabledSupplier(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDeleteSupplier(elements) {
        setLoadingSupplierReturns(true)
        const result = await Promise.all(elements.map(e => destroySupplierReturn(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSupplierReturns([...supplierReturns.filter(sr => !ids.includes(sr.id))])
            setMessage(`${result.length === 1 ? 'Registro eliminado' : 'Registros eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSupplierReturns(false)
        setOpenSupplier(null)
    }

    const headCellsClient = [
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
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => `${row.article.sale_price * row.amount} ${row.article.currency.iso}`
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

    const headCellsSupplier = [
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
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: (row) => row.supplier.name
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: true,
            label: 'Cantidad',
            accessor: 'amount'
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: 'Total',
            accessor: (row) => `${row.article.purchase_price * row.amount} ${row.article.currency.iso}`
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
        <Layout title="Devoluciones">
            {loadingSuppliers ||
                loadingClients ||
                loadingArticles ||
                loadingClientReturns ||
                loadingSupplierReturns ||
                disabledClient ||
                disabledSupplier ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <DataGrid
                        title="Devoluciones de clientes"
                        headCells={headCellsClient}
                        rows={clientReturns}
                        open={openClient}
                        setOpen={setOpenClient}
                        data={formDataClient}
                        setData={setFormDataClient}
                        handleDelete={handleDeleteClient}
                    >
                        <ModalComponent open={openClient === 'NEW' || openClient === 'EDIT'} onClose={() => resetClient(setOpenClient)}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {openClient === 'NEW' && 'Ingresar nueva devolución'}
                                {openClient === 'EDIT' && 'Editar registro de devolución'}
                            </Typography>
                            <form onChange={handleChangeClient} onSubmit={handleSubmitClient}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl>
                                        <InputLabel id="article-select">Artículo</InputLabel>
                                        <Select
                                            labelId="article-select"
                                            id="article_id"
                                            value={formDataClient.article_id}
                                            label="Artículo"
                                            name="article_id"
                                            onChange={handleChangeClient}
                                        >
                                            {articles.map(art => (
                                                <MenuItem key={art.id} value={art.id}>{art.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errorsClient.article_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El artículo es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id="client-select">Cliente</InputLabel>
                                        <Select
                                            labelId="client-select"
                                            id="client_id"
                                            value={formDataClient.client_id}
                                            label="Cliente"
                                            name="client_id"
                                            onChange={handleChangeClient}
                                        >
                                            {clients.map(c => (
                                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errorsClient.client_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El cliente es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="amount">Cantidad</InputLabel>
                                        <Input id="amount" type="number" name="amount" value={formDataClient.amount} />
                                        {errorsClient.amount?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La cantidad es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                        <Input id="observations" type="text" name="observations" value={formDataClient.observations} />
                                        {errorsClient.observations?.type === 'maxLength' &&
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
                                        <Button type="button" variant="outlined" onClick={() => resetClient(setOpenClient)} sx={{
                                            width: '50%'
                                        }}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={disabledClient} sx={{
                                            width: '50%'
                                        }}>
                                            Guardar
                                        </Button>
                                    </FormControl>
                                </Box>
                            </form>
                        </ModalComponent>
                    </DataGrid>
                    <Box sx={{ marginY: 5 }} />
                    <DataGrid
                        title="Devoluciones a proveedores"
                        headCells={headCellsSupplier}
                        rows={supplierReturns}
                        open={openSupplier}
                        setOpen={setOpenSupplier}
                        data={formDataSupplier}
                        setData={setFormDataSupplier}
                        handleDelete={handleDeleteSupplier}
                    >
                        <ModalComponent open={openSupplier === 'NEW' || openSupplier === 'EDIT'} onClose={() => resetSupplier(setOpenSupplier)}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {openSupplier === 'NEW' && 'Ingresar nueva devolución'}
                                {openSupplier === 'EDIT' && 'Editar registro de devolución'}
                            </Typography>
                            <form onChange={handleChangeSupplier} onSubmit={handleSubmitSupplier}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl>
                                        <InputLabel id="article-select">Artículo</InputLabel>
                                        <Select
                                            labelId="article-select"
                                            id="article_id"
                                            value={formDataSupplier.article_id}
                                            label="Proveedor"
                                            name="article_id"
                                            onChange={handleChangeSupplier}
                                        >
                                            {articles.map(art => (
                                                <MenuItem key={art.id} value={art.id}>{art.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errorsSupplier.article_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El artículo es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id="supplier-select">Proveedor</InputLabel>
                                        <Select
                                            labelId="supplier-select"
                                            id="supplier_id"
                                            value={formDataSupplier.supplier_id}
                                            label="Proveedor"
                                            name="supplier_id"
                                            onChange={handleChangeSupplier}
                                        >
                                            {suppliers.map(s => (
                                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errorsSupplier.supplier_id?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El proveedor es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="amount">Cantidad</InputLabel>
                                        <Input id="amount" type="number" name="amount" value={formDataSupplier.amount} />
                                        {errorsSupplier.amount?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La cantidad es requerida.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                                        <Input id="observations" type="text" name="observations" value={formDataSupplier.observations} />
                                        {errorsSupplier.observations?.type === 'maxLength' &&
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
                                        <Button type="button" variant="outlined" onClick={() => resetSupplier(setOpenSupplier)} sx={{
                                            width: '50%'
                                        }}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" variant="contained" disabled={disabledSupplier} sx={{
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