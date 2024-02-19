import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Box, Button, LinearProgress, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material"
import { format } from "date-fns"
import PrintSharpIcon from '@mui/icons-material/PrintSharp'

import { useApi } from "../hooks/useApi"
import { useProducts } from "../hooks/useProducts"
import { AuthContext } from "../providers/AuthProvider"
import { Layout } from "../components/Layout"
import { Payments } from "../components/Payments"

import { REPORT_URL, SALE_URL } from "../utils/urls"
import { getCurrentSubtotal, getDeadline, getSaleDifference, getSaleTotal } from "../utils/helpers"

function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}

export function SaleDetails() {

    const { auth } = useContext(AuthContext)

    const { id } = useParams()
    const navigate = useNavigate()

    const { products } = useProducts()
    const { getById } = useApi(SALE_URL)

    const [sale, setSale] = useState(null)
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(0)

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

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        }
    }

    return (
        <>
            {!sale || loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Layout title={`${sale.type === 'CUENTA_CORRIENTE' ? 'Cuenta corriente ' : 'Venta al contado'} N° ${sale.id}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Detalle" {...a11yProps(0)} />
                            <Tab label="Pagos" {...a11yProps(1)} />
                        </Tabs>
                        <Link
                            to={`${REPORT_URL}/account-details/${auth.token}/${sale.id}`}
                            target="_blank"
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <Button>
                                    <PrintSharpIcon />
                                </Button>
                            </Box>
                        </Link>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
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
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                        <TableCell align="center">
                                            {getCurrentSubtotal(sale.sale_products, products)}
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
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Monto por cuota</TableCell>
                                        <TableCell align="center">
                                            ${(getSaleTotal(sale).replace('$', '') / sale.installments).toFixed(2)}
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
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Payments
                            sale={sale}
                            setSale={setSale}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </CustomTabPanel>
                </Layout>
            }
        </>
    )
}