import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "../hooks/useApi";
import { useForm } from "../hooks/useForm";
import { useCountries } from "../hooks/useCountries";

import { Layout } from "../components/Layout";
import { DataGrid } from "../components/DataGrid";
import { ModalComponent } from "../components/ModalComponent";

import { SUPPLIER_URL } from "../utils/urls";

export function Suppliers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(SUPPLIER_URL)
    const { countries, loadingCountries } = useCountries()

    const [loading, setLoading] = useState(true)
    const [suppliers, setSuppliers] = useState([])
    const [open, setOpen] = useState(null)
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            email: '',
            address: '',
            city: '',
            province: '',
            country_id: ''
        },
        rules: {
            name: {
                required: true,
                maxLength: 55
            },
            email: {
                required: true,
                maxLength: 55
            },
            address: {
                required: true,
                maxLength: 55
            },
            city: {
                required: true,
                maxLength: 55
            },
            province: {
                required: true,
                maxLength: 55
            },
            country_id: {
                required: true
            }
        }
    })

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setSuppliers(data)
                setLoading(false)
            }
        })()
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

    async function handleDelete(elements) {
        setLoading(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setSuppliers([...suppliers.filter(s => !ids.includes(s.id))])
            setMessage(`${result.length === 1 ? 'Proveedor eliminado' : 'Proveedores eliminados'} correctamente.`)
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoading(false)
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
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'city',
            numeric: false,
            disablePadding: true,
            label: 'Ciudad',
            accessor: 'city'
        },
        {
            id: 'province',
            numeric: false,
            disablePadding: true,
            label: 'Provincia',
            accessor: 'province'
        },
        {
            id: 'country',
            numeric: false,
            disablePadding: true,
            label: 'País',
            accessor: (row) => row.country.name
        }
    ]

    return (
        <Layout title="Proveedores">
            {loading || loadingCountries || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Proveedores de artículos"
                    headCells={headCells}
                    rows={suppliers}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
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
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="email" name="email" value={formData.email} />
                                    {errors.email?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es requerido.
                                        </Typography>
                                    }
                                    {errors.email?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="address">Dirección</InputLabel>
                                    <Input id="address" type="text" name="address" value={formData.address} />
                                    {errors.address?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La dirección es requerida.
                                        </Typography>
                                    }
                                    {errors.address?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La dirección es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="city">Ciudad</InputLabel>
                                    <Input id="city" type="text" name="city" value={formData.city} />
                                    {errors.city?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La ciudad es requerida.
                                        </Typography>
                                    }
                                    {errors.city?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La ciudad es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="province">Provincia / Estado</InputLabel>
                                    <Input id="province" type="text" name="province" value={formData.province} />
                                    {errors.province?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La provincia es requerida.
                                        </Typography>
                                    }
                                    {errors.province?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La provincia es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel id="country-select">País</InputLabel>
                                    <Select
                                        labelId="country-select"
                                        id="country_id"
                                        value={formData.country_id}
                                        label="País"
                                        name="country_id"
                                        onChange={handleChange}
                                    >
                                        {countries.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.country_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El país es requerido.
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