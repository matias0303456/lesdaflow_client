import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/Layout";
import { ModalComponent } from "../components/ModalComponent";
import { SupplierFilter } from "../components/filters/SupplierFilter";
import { DataGridWithBackendPagination } from "../components/DataGridWithBackendPagination";

export function Suppliers() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    const { suppliers, setSuppliers, loadingSuppliers, handleSubmit, handleDelete, setOpen, open, getSuppliers } = useSuppliers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            name: '',
            business_name: '',
            cuil: '',
            address: '',
            cell_phone: '',
            business_phone: '',
            email: '',
            products: []
        },
        rules: {
            name: {
                required: true,
                maxLength: 255
            },
            business_name: {
                required: true,
                maxLength: 255
            },
            cuil: {
                maxLength: 255
            },
            address: {
                maxLength: 255
            },
            cell_phone: {
                required: true,
                maxLength: 255
            },
            business_phone: {
                maxLength: 255
            },
            email: {
                maxLength: 255
            }
        }
    })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR') navigate('/productos')
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Código',
            accessor: 'id'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: 'name'
        },
        {
            id: 'business_name',
            numeric: false,
            disablePadding: true,
            label: 'Razón Social',
            accessor: 'business_name'
        },
        {
            id: 'cuil',
            numeric: false,
            disablePadding: true,
            label: 'CUIL',
            accessor: 'cuil'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: 'address'
        },
        {
            id: 'cell_phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            sorter: (row) => row.phone ?? '',
            accessor: 'cell_phone'
        },
        {
            id: 'business_phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            sorter: (row) => row.phone ?? '',
            accessor: 'business_phone'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            sorter: (row) => row.email ?? '',
            accessor: 'email'
        },

    ]

    return (
        <Layout title="Proveedores">
            <DataGridWithBackendPagination
                loading={loadingSuppliers || disabled}
                headCells={headCells}
                rows={suppliers}
                entityKey="suppliers"
                getter={getSuppliers}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction
                showDeleteAction
                showViewAction
                contentHeader={
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
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
                        <SupplierFilter suppliers={suppliers} setSuppliers={setSuppliers} />
                    </Box>
                }
            >
                <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={() => reset(setOpen)}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {open === 'NEW' && 'Nuevo proveedor'}
                        {open === 'EDIT' && 'Editar proveedor'}
                        {open === 'VIEW' && `Proveedor #${formData.id}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', gap: 5 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="name">Nombre Completo</InputLabel>
                                    <Input id="name" type="text" name="name" value={formData.name} disabled={open === 'VIEW'} />
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
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="business_name">Razón Social</InputLabel>
                                    <Input id="business_name" type="text" name="business_name" value={formData.business_name} disabled={open === 'VIEW'} />
                                    {errors.business_name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La razón social es requerida.
                                        </Typography>
                                    }
                                    {errors.business_name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La razón social es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 5 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="cuil">CUIL</InputLabel>
                                    <Input id="cuil" type="text" name="cuil" value={formData.cuil} disabled={open === 'VIEW'} />
                                    {errors.cuil?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El CUIL es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="email" name="email" value={formData.email} disabled={open === 'VIEW'} />
                                    {errors.email?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 5 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                                    <Input id="cell_phone" type="text" name="cell_phone" value={formData.cell_phone} disabled={open === 'VIEW'} />
                                    {errors.cell_phone?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El celular es requerido.
                                        </Typography>
                                    }
                                    {errors.cell_phone?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El celular es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="business_phone">Teléfono Particular</InputLabel>
                                    <Input id="business_phone" type="text" name="business_phone" value={formData.business_phone} disabled={open === 'VIEW'} />
                                    {errors.business_phone?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El teléfono es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel htmlFor="address">Dirección</InputLabel>
                                <Input id="address" type="text" name="address" value={formData.address} disabled={open === 'VIEW'} />
                                {errors.address?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * La dirección es demasiado larga.
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
                                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                                </Button>
                                {(open === 'NEW' || open === 'EDIT') &&
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Confirmar
                                    </Button>
                                }
                            </FormControl>
                        </Box>
                    </form>
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de proveedor
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '35%' }}
                            onClick={() => handleDelete(formData)}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout>
    )
}