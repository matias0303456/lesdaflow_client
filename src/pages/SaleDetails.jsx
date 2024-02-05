import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";

import { useApi } from "../hooks/useApi";
import { Layout } from "../components/Layout";
import { Payments } from "../components/Payments";

import { SALE_URL } from "../utils/urls";
import { getDeadline, getSaleDifference, getSaleTotal } from "../utils/helpers";

export function SaleDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const { getById } = useApi(SALE_URL)

    const [sale, setSale] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const { status, data } = await getById(id)
            if (status === 200) {
                setSale(data)
                setLoading(false)
            } else {
                navigate('/veroshop/ventas')
            }
        })()
    }, [])

    return (
        <>
            {!sale || loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Layout title={'Cuenta corriente N° ' + sale.id}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                                    <TableCell align="center">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Código</TableCell>
                                                    <TableCell align="center">Nombre</TableCell>
                                                    <TableCell align="center">Dirección</TableCell>
                                                    <TableCell align="center">Teléfono</TableCell>
                                                    <TableCell align="center">Email</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center">{sale.client.code}</TableCell>
                                                    <TableCell align="center">{sale.client.name}</TableCell>
                                                    <TableCell align="center">{sale.client.address}</TableCell>
                                                    <TableCell align="center">{sale.client.phone}</TableCell>
                                                    <TableCell align="center">{sale.client.email}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Productos</TableCell>
                                    <TableCell align="center">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Código</TableCell>
                                                    <TableCell align="center">Detalle</TableCell>
                                                    <TableCell align="center">Talle</TableCell>
                                                    <TableCell align="center">P. compra</TableCell>
                                                    <TableCell align="center">Cantidad</TableCell>
                                                    <TableCell align="center">Proveedor</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sale.sale_products.map(sp => (
                                                    <TableRow key={sp.id}>
                                                        <TableCell align="center">{sp.product.code}</TableCell>
                                                        <TableCell align="center">{sp.product.details}</TableCell>
                                                        <TableCell align="center">{sp.product.size}</TableCell>
                                                        <TableCell align="center">${sp.product.buy_price}</TableCell>
                                                        <TableCell align="center">{sp.amount}</TableCell>
                                                        <TableCell align="center">{sp.product.supplier.name}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Descuento</TableCell>
                                    <TableCell align="center">
                                        {sale.discount}%
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cuotas</TableCell>
                                    <TableCell align="center">
                                        {sale.installments}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                    <TableCell align="center">
                                        {format(new Date(sale.date), 'dd-MM-yyyy')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vencimiento</TableCell>
                                    <TableCell align="center">
                                        {format(new Date(getDeadline(sale.date, sale.installments)), 'dd-MM-yyyy')}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Vendedor</TableCell>
                                    <TableCell align="center">
                                        {sale.client.user.username}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Observaciones</TableCell>
                                    <TableCell align="center">
                                        {sale.observations}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Importe</TableCell>
                                    <TableCell align="center">
                                        {getSaleTotal(sale)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Saldo</TableCell>
                                    <TableCell align="center">
                                        {getSaleDifference(sale)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ marginTop: 2 }}>
                        <Payments
                            sale={sale}
                            setSale={setSale}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Box>
                </Layout>
            }
        </>
    )
}