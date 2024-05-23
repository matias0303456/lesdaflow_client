import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useProducts } from '../hooks/useProducts'
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";
import { useApi } from "../hooks/useApi";

import { AuthContext } from "../providers/AuthProvider";
import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
import { ProductFilter } from "../components/filters/ProductFilter";
import { OrderFilter } from "../components/filters/OrderFilter";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

import { PRODUCT_URL } from "../utils/urls";
import { getNewPrice, getStock } from "../utils/helpers";

export function Orders() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, putMassive, destroy } = useApi(PRODUCT_URL)
    const { products, setProducts, loadingProducts, setLoadingProducts } = useProducts()
    const { suppliers, loadingSuppliers, getSuppliers } = useSuppliers()
    const [open, setOpen] = useState(null)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            code: '',
            details: '',
            buy_price: '',
            min_stock: '',
            earn: '',
            size: '',
            supplier_id: '',
            amount: '',
            observations: ''
        },
        rules: {
            code: {
                required: true,
                maxLength: 55
            },
            details: {
                required: true,
                maxLength: 55
            },
            buy_price: {
                required: true
            },
            min_stock: {
                required: true
            },
            earn: {
                required: true
            },
            size: {
                maxLength: 55,
                required: true
            },
            supplier_id: {
                required: true
            },
            amount: {
                required: open === 'NEW'
            },
            observations: {
                maxLength: 55
            }
        }
    })

    const [massiveEdit, setMassiveEdit] = useState([])
    const [massiveEditPercentage, setMassiveEditPercentage] = useState(0)
    const [earnPrice, setEarnPrice] = useState(0)

    useEffect(() => {
        getSuppliers()
    }, [])

    useEffect(() => {
        const buy_price = formData.buy_price.toString().length === 0 ? 0 : parseInt(formData.buy_price)
        const earn = formData.earn.toString().length === 0 ? 0 : parseInt(formData.earn)
        setEarnPrice(`$${(buy_price + ((buy_price / 100) * earn)).toFixed(2)}`)
    }, [formData])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setProducts([data, ...products])
                    setMessage('Producto creado correctamente.')
                } else {
                    setProducts([data, ...products.filter(p => p.id !== formData.id)])
                    setMessage('Producto editado correctamente.')
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

    async function handleSubmitMassive() {
        setLoadingProducts(true)
        const body = {
            products: massiveEdit.map(me => ({ id: me.id, buy_price: me.buy_price })),
            percentage: parseInt(massiveEditPercentage)
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            setProducts([...data, ...products.filter(p => !data.map(d => d.id).includes(p.id))])
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            reset(setOpen)
            setMassiveEdit([])
            setMassiveEditPercentage(0)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setLoadingProducts(false)
        setOpenMessage(true)
    }

    async function handleDelete(elements) {
        setLoadingProducts(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setProducts([...products.filter(p => !ids.includes(p.id))])
            setMessage(`${result.length === 1 ? 'Producto eliminado' : 'Productos eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen productos con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingProducts(false)
        setOpen(null)
    }

    const headCells = [
        {
            id: 'order_code',
            numeric: false,
            disablePadding: true,
            label: 'Cód. Pedido',
            accessor: 'order_code'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            // sorter: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy'),
            // accessor: (row) => format(new Date(getDeadline(row.date, row.installments)), 'dd/MM/yy')
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            sorter: (row) => row.supplier.name.toLowerCase(),
            accessor: (row) => row.supplier.name
        },
        {
            id: 'supplier_code',
            numeric: false,
            disablePadding: true,
            label: 'Razón Social',
            accessor: "supplier_code"
        },
        {
            id: "entry_date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            accessor: "entry_date"
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: "Estado",
            accessor: "status"
        },
        {
            id: "seller",
            numeric: false,
            disablePadding: true,
            label: "Vendedor",
            accessor: "seller"
        },
    ]

    return (
        <Layout title="Pedidos">
            <DataGridWithBackendPagination
                loading={loadingProducts || loadingSuppliers || disabled}
                headCells={headCells}
                rows={products}
                setOpen={setOpen}
                setFormData={setFormData}
                deadlineColor="pedidos"
                contentHeader={
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen('NEW')}>
                                Agregar
                            </Button>
                            <Button variant="outlined" color='success'>
                                Excel
                            </Button>
                        </Box>
                        <OrderFilter />
                    </Box>
                }
            />
        </Layout>
    )
}