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
    const { formData: accountData, handleChange: changeAccount } = useForm({
        defaultData: { client_id: '' },
        rules: { client_id: { required: true } }
    })
    const { formData: productHistoryData, handleChange: changeProduct } = useForm({
        defaultData: { product_id: '' },
        rules: { product_id: { required: true } }
    })

    const [canDownloadAccountReport, setCanDownloadAccountReport] = useState(false)
    const [canDownloadProductReport, setCanDownloadProductReport] = useState(false)

    useEffect(() => {
        setCanDownloadAccountReport(accountData.client_id.toString().length > 0)
    }, [accountData])

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
                            Estado de cuenta
                        </Typography>
                        <Typography variant="caption" color="gray">
                            En este reporte se detallan las ventas, los pagos y el
                            estado de la cuenta vinculada al cliente seleccionado.
                        </Typography>
                        <form onChange={changeAccount} style={{ marginTop: 10 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }} >
                                    <InputLabel id="client-select">Cliente</InputLabel>
                                    <Select
                                        labelId="client-select"
                                        id="category_id"
                                        value={accountData.client_id}
                                        label="Cliente"
                                        name="client_id"
                                        onChange={changeAccount}
                                    >
                                        {clients.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{`${c.code} - ${c.name}`}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Link
                                    to={canDownloadAccountReport ? `${REPORT_URL}/account-status/${auth.token}/${accountData.client_id}` : '#'}
                                    target={canDownloadAccountReport ? "_blank" : '_self'}
                                    style={{ width: { xs: '30%', lg: '50%' }, cursor: canDownloadAccountReport ? 'pointer' : 'auto' }}
                                >
                                    <Button type="button" variant="contained" disabled={!canDownloadAccountReport}>
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