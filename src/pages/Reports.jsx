import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from '../hooks/useForm'
import { useClients } from "../hooks/useClients";
import { useProducts } from '../hooks/useProducts'

import { Layout } from "../components/Layout";

import { REPORT_URL } from "../utils/urls";

export function Reports() {

    const { auth } = useContext(AuthContext)

    const { clients, loadingClients } = useClients()
    const { products, loadingProducts } = useProducts()
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
        setCanDownloadClientReport(clientData.client_id.toString().length > 0)
    }, [clientData])

    useEffect(() => {
        setCanDownloadProductReport(productHistoryData.product_id.toString().length > 0)
    }, [productHistoryData])

    return (
        <Layout title="Reportes">
            {loadingClients || loadingProducts ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box>
                    <Box>
                        <Typography variant="h6" sx={{ marginTop: { xs: 3, sm: 0 } }}>
                            Detalle de cliente
                        </Typography>
                        <Typography variant="caption" color="gray">
                            En este reporte se detallan las ventas y los pagos y del cliente seleccionado.
                        </Typography>
                        <form onChange={changeClient} style={{ marginTop: 10 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }} >
                                    <InputLabel id="client-select">Cliente</InputLabel>
                                    <Select
                                        labelId="client-select"
                                        id="category_id"
                                        value={clientData.client_id}
                                        label="Cliente"
                                        name="client_id"
                                        onChange={changeClient}
                                    >
                                        {clients.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{`${c.code} - ${c.name}`}</MenuItem>
                                        ))}
                                    </Select>
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
                        <form onChange={changeProduct} style={{ marginTop: 10 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }} >
                                    <InputLabel id="product-select">Producto</InputLabel>
                                    <Select
                                        labelId="product-select"
                                        id="product_id"
                                        value={productHistoryData.product_id}
                                        label="Producto"
                                        name="product_id"
                                        onChange={changeProduct}
                                    >
                                        {products.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{`${p.code} - ${p.details}`}</MenuItem>
                                        ))}
                                    </Select>
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
            }
        </Layout >
    )
}