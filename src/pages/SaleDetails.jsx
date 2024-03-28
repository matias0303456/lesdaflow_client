import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { format } from "date-fns"
import PrintSharpIcon from '@mui/icons-material/PrintSharp'

import { useApi } from "../hooks/useApi"
import { AuthContext } from "../providers/AuthProvider"
import { Layout } from "../components/Layout"
import { Payments } from "../components/Payments"

import { REPORT_URL, SALE_URL } from "../utils/urls"
import { getAmountByInstallment, getDeadline, getSaleSubtotal, setLocalDate } from "../utils/helpers"

export function SaleDetails() {

    const { auth } = useContext(AuthContext)

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
                <Layout title={`${sale.type === 'CUENTA_CORRIENTE' ? 'Cuenta corriente ' : 'Venta al contado'} N° ${sale.id}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                        <Link
                            to={`${REPORT_URL}/account-details/${auth.token}/${sale.id}`}
                            target="_blank"
                        >
                            <Button>
                                <PrintSharpIcon />
                            </Button>
                        </Link>
                    </Box>
                    <Box sx={{ width: '90%', margin: '0 auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>CLIENTE</strong> {sale.client.name}
                                </Typography>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>DIRECCIÓN</strong> {sale.client.address}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>TELÉFONO</strong> {sale.client.phone}
                                </Typography>
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ color: '#8B4992' }}>CANTIDAD</TableCell>
                                        <TableCell align="center" sx={{ color: '#8B4992' }}>CÓDIGO</TableCell>
                                        <TableCell align="center" sx={{ color: '#8B4992' }}>PRODUCTO</TableCell>
                                        <TableCell align="center" sx={{ color: '#8B4992' }}>PRECIO UNITARIO</TableCell>
                                        <TableCell align="center" sx={{ color: '#8B4992' }}>TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sale.sale_products.map(sp => (
                                        <TableRow key={sp.id}>
                                            <TableCell align="center">{sp.amount}</TableCell>
                                            <TableCell align="center">{sp.product.code}</TableCell>
                                            <TableCell align="center">{sp.product.details}</TableCell>
                                            <TableCell align="center">${(sp.buy_price + ((sp.buy_price / 100) * sp.earn)).toFixed(2)}</TableCell>
                                            <TableCell align="center">${((sp.buy_price + ((sp.buy_price / 100) * sp.earn)) * sp.amount).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>SUBTOTAL</strong> {getSaleSubtotal(sale)}
                                </Typography>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>CUOTAS</strong> {sale.installments}
                                </Typography>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>TOTAL POR CUOTA</strong> {getAmountByInstallment(sale)}
                                </Typography>
                                <Typography variant="p">
                                    <strong style={{ color: '#8B4992' }}>VENCIMIENTO</strong> {format(new Date(setLocalDate(getDeadline(sale.date, sale.installments))), 'dd-MM-yyyy')}
                                </Typography>
                            </Box>
                        </Box>
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