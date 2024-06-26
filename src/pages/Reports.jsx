import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Autocomplete, Box, Button, FormControl, TextField, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { SearchContext } from "../providers/SearchProvider";
import { useForm } from '../hooks/useForm'

import { Layout } from "../components/Layout";

import { CLIENT_URL, PRODUCT_URL, REPORT_URL } from "../utils/urls";

export function Reports() {

    const { auth } = useContext(AuthContext)
    const { searchClients, setSearchClients, searchProducts, setSearchProducts } = useContext(SearchContext)

    const { formData: clientData, handleChange: changeClient } = useForm({
        defaultData: { client_id: '' },
        rules: { client_id: { required: true } }
    })
    const { formData: productHistoryData, handleChange: changeProduct } = useForm({
        defaultData: { product_id: '' },
        rules: { product_id: { required: true } }
    })

    const [canDownloadClientReport, setCanDownloadClientReport] = useState(false)
    const [canDownloadProductReport, setCanDownloadProductReport] = useState(false)

    useEffect(() => {
        (async () => {
            const res = await fetch(CLIENT_URL + '/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const data = await res.json()
            if (res.status === 200) setSearchClients(data)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const res = await fetch(PRODUCT_URL + '/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.token
                }
            })
            const data = await res.json()
            if (res.status === 200) setSearchProducts(data)
        })()
    }, [])

    useEffect(() => {
        setCanDownloadClientReport(clientData.client_id.toString().length > 0)
    }, [clientData])

    useEffect(() => {
        setCanDownloadProductReport(productHistoryData.product_id.toString().length > 0)
    }, [productHistoryData])

    return (
        <Layout title="Reportes">
            <Box>
                <Box>
                    <Typography variant="h6" sx={{ marginTop: { xs: 3, sm: 0 } }}>
                        Detalle de cliente
                    </Typography>
                    <Typography variant="caption" color="gray">
                        En este reporte se detallan las ventas y los pagos y del cliente seleccionado.
                    </Typography>
                    <form style={{ marginTop: 10 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                            <FormControl sx={{ width: '50%' }} >
                                <Autocomplete
                                    disablePortal
                                    id="client-autocomplete"
                                    value={clientData.client_id.toString().length > 0 ? `${searchClients.find(c => c.id === clientData.client_id)?.code} - ${searchClients.find(c => c.id === clientData.client_id)?.name}` : ''}
                                    options={searchClients.map(c => ({ label: `${c.code} - ${c.name}`, id: c.id }))}
                                    noOptionsText="No hay clientes registrados."
                                    onChange={(e, value) => changeClient({ target: { name: 'client_id', value: value?.id ?? '' } })}
                                    renderInput={(params) => <TextField {...params} label="Cliente" />}
                                    isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                />
                            </FormControl>
                            <Link
                                to={canDownloadClientReport ? `${REPORT_URL}/client-details/${auth.token}/${clientData.client_id}` : '#'}
                                target={canDownloadClientReport ? "_blank" : '_self'}
                                style={{ width: { xs: '30%', lg: '50%' }, cursor: canDownloadClientReport ? 'pointer' : 'auto' }}
                            >
                                <Button type="button" variant="contained" disabled={!canDownloadClientReport}>
                                    Descargar PDF
                                </Button>
                            </Link>
                        </Box>
                    </form>
                </Box>
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6" sx={{ marginTop: { xs: 3, sm: 0 } }}>
                        Historial de producto
                    </Typography>
                    <Typography variant="caption" color="gray">
                        En este reporte se detallan los ingresos, las ventas
                        y los pagos del producto seleccionado.
                    </Typography>
                    <form style={{ marginTop: 10 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                            <FormControl sx={{ width: '50%' }} >
                                <Autocomplete
                                    disablePortal
                                    id="product-autocomplete"
                                    options={searchProducts.map(p => ({ label: `Código ${p.code} / Detalle ${p.details} / Talle ${p.size}`, id: p.id }))}
                                    noOptionsText="No hay productos disponibles."
                                    onChange={(e, value) => changeProduct({ target: { name: 'product_id', value: value?.id ?? '' } })}
                                    renderInput={(params) => <TextField {...params} label="Producto" />}
                                    isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                />
                            </FormControl>
                            <Link
                                to={canDownloadProductReport ? `${REPORT_URL}/product-history/${auth.token}/${productHistoryData.product_id}` : '#'}
                                target={canDownloadProductReport ? "_blank" : '_self'}
                                style={{ width: { xs: '30%', lg: '50%' }, cursor: canDownloadProductReport ? 'pointer' : 'auto' }}
                            >
                                <Button type="button" variant="contained" disabled={!canDownloadProductReport}>
                                    Descargar PDF
                                </Button>
                            </Link>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Layout >
    )
}