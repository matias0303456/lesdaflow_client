import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";
import { useNavigate } from "react-router-dom";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";
import { SupplierFilter } from "../components/filters/SupplierFilter";

import { SUPPLIER_URL } from "../utils/urls";
import { getNewPrice } from "../utils/helpers";

export function Suppliers() {

    const { auth } = useContext(AuthContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate()

    const { post, put, destroy, putMassive } = useApi(SUPPLIER_URL)
    const { suppliers, setSuppliers, loadingSuppliers, setLoadingSuppliers, getSuppliers } = useSuppliers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            address: '',
            city: '',
            province: '',
            email: '',
            phone: '',
            products: []
        },
        rules: {
            name: {
                required: true,
                maxLength: 55
            },
            address: {
                maxLength: 55
            },
            city: {
                maxLength: 55
            },
            province: {
                maxLength: 55
            },
            email: {
                maxLength: 55
            },
            phone: {
                maxLength: 55
            }
        }
    })

    const [open, setOpen] = useState(null)
    const [massiveEditPercentage, setMassiveEditPercentage] = useState(0)

    useEffect(() => {
        if (auth?.user.role.name !== 'ADMINISTRADOR') navigate('/veroshop/productos')
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSuppliers([data, ...suppliers])
                    setMessage('Proveedor creado correctamente.')
                } else {
                    setSuppliers([data, ...suppliers.filter(s => s.id !== formData.id)])
                    setMessage('Proveedor editado correctamente.')
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
        setLoadingSuppliers(true)
        const body = {
            supplier: formData.id,
            products: formData.products.map(p => ({ id: p.id, buy_price: p.buy_price })),
            percentage: parseInt(massiveEditPercentage)
        }
        const { status, data } = await putMassive(body)
        if (status === 200) {
            setSuppliers([data, ...suppliers.filter(s => s.id !== data.id)])
            setMessage('Precios actualizados correctamente.')
            setSeverity('success')
            reset(setOpen)
            setMassiveEditPercentage(0)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setLoadingSuppliers(false)
        setOpenMessage(true)
    }

    async function handleDelete(elements) {
        setLoadingSuppliers(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSuppliers([...suppliers.filter(s => !ids.includes(s.id))])
            setMessage(`${result.length === 1 ? 'Proveedor eliminado' : 'Proveedores eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            if (result.some(r => r.status === 300)) {
                setMessage('Existen proveedores con datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSuppliers(false)
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
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            sorter: (row) => row.address ?? '',
            accessor: 'address'
        },
        {
            id: 'city',
            numeric: false,
            disablePadding: true,
            label: 'Ciudad',
            sorter: (row) => row.city ?? '',
            accessor: 'city'
        },
        {
            id: 'province',
            numeric: false,
            disablePadding: true,
            label: 'Provincia',
            sorter: (row) => row.province ?? '',
            accessor: 'province'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            sorter: (row) => row.email ?? '',
            accessor: 'email'
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            sorter: (row) => row.phone ?? '',
            accessor: 'phone'
        }
    ]

    return (
        <Layout title="Proveedores">
            {loadingSuppliers || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <>
                    <SupplierFilter suppliers={suppliers} setSuppliers={setSuppliers} />
                    <DataGrid
                        title=""
                        headCells={headCells}
                        rows={suppliers}
                        open={open}
                        setOpen={setOpen}
                        data={formData}
                        setData={setFormData}
                        handleDelete={handleDelete}
                        updateByPercentage
                        pageKey="suppliers"
                        getter={getSuppliers}
                    >
                        <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {open === 'NEW' && 'Nuevo proveedor'}
                                {open === 'EDIT' && 'Editar proveedor'}
                            </Typography>
                            <form onChange={handleChange} onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <FormControl>
                                        <InputLabel htmlFor="name">Nombre</InputLabel>
                                        <Input id="name" type="text" name="name" value={formData.name} />
                                        {errors.name?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El nombre es requerido.
                                            </Typography>
                                        }
                                        {errors.name?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El nombre es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="address">Dirección</InputLabel>
                                        <Input id="address" type="text" name="address" value={formData.address} />
                                        {errors.address?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La dirección es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="city">Ciudad</InputLabel>
                                        <Input id="city" type="text" name="city" value={formData.city} />
                                        {errors.city?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La ciudad es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="province">Provincia / Estado</InputLabel>
                                        <Input id="province" type="text" name="province" value={formData.province} />
                                        {errors.province?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La provincia es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="email">Email</InputLabel>
                                        <Input id="email" type="text" name="email" value={formData.email} />
                                        {errors.email?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El email es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="phone">Teléfono</InputLabel>
                                        <Input id="phone" type="number" name="phone" value={formData.phone} />
                                        {errors.phone?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El teléfono es demasiado largo.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        marginTop: 1,
                                        width: '50%'
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
                        <ModalComponent open={open === 'MASSIVE-EDIT'} dynamicContent>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Actualización de precios del proveedor {formData.name}
                            </Typography>
                            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Producto</TableCell>
                                            <TableCell align="center">Código</TableCell>
                                            <TableCell align="center">Precio actual</TableCell>
                                            <TableCell align="center">Precio nuevo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formData.products.map(p => (
                                            <TableRow
                                                key={p.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{p.code}</TableCell>
                                                <TableCell align="center">{p.details}</TableCell>
                                                <TableCell align="center">${p.buy_price.toFixed(2)}</TableCell>
                                                <TableCell align="center">${getNewPrice(p, massiveEditPercentage)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                marginTop: 5,
                                marginBottom: 5
                            }}>
                                <Typography variant="h6">
                                    Porcentaje
                                </Typography>
                                <Input
                                    type="number"
                                    value={massiveEditPercentage}
                                    disabled={formData.products.length === 0}
                                    onChange={e => setMassiveEditPercentage(e.target.value)}
                                />
                                <Typography variant="h6">
                                    %
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                width: '60%',
                                margin: '0 auto'
                            }}>
                                <Button type="button" variant="outlined"
                                    sx={{ width: '50%' }}
                                    onClick={() => {
                                        reset(setOpen)
                                        setMassiveEditPercentage(0)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained"
                                    sx={{ width: '50%' }}
                                    disabled={formData.products.length === 0}
                                    onClick={handleSubmitMassive}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </ModalComponent>
                    </DataGrid>
                </>
            }
        </Layout>
    )
}