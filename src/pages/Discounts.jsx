import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useDiscounts } from "../hooks/useDiscounts";
import { useSuppliers } from "../hooks/useSuppliers";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { useProducts } from "../hooks/useProducts";

export function Discounts() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { getProducts, loadingProducts } = useProducts()
    const { getSuppliers, loadingSuppliers } = useSuppliers()
    const { loadingDiscounts, handleSubmit, handleDelete, open, setOpen, getDiscounts, headCells, discountFormData } = useDiscounts()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = discountFormData

    useEffect(() => {
        if (auth?.user.role !== "ADMINISTRADOR") {
            navigate(auth?.user.role === 'CHOFER' ? '/prep-ventas' : "/productos");
        } else {
            getSuppliers()
            getProducts()
        }
    }, []);

    return (
        <Layout title="Descuentos">
            <DataGridWithBackendPagination
                headCells={headCells}
                loading={loadingDiscounts || loadingSuppliers || loadingProducts || disabled}
                rows={state.discounts.data}
                entityKey="discounts"
                getter={getDiscounts}
                setOpen={setOpen}
                setFormData={setFormData}
                showEditAction
                showDeleteAction
                showViewAction
                contentHeader={
                    <Box>
                        <Button variant="outlined" onClick={() => setOpen('NEW')}>
                            Agregar
                        </Button>
                    </Box>
                }
            >
                <ModalComponent open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'} onClose={reset}>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl>
                                <InputLabel htmlFor="name">Nombre *</InputLabel>
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
                            <FormControl>
                                <InputLabel id="type-select">Tipo</InputLabel>
                                <Select
                                    labelId="type-select"
                                    id="type"
                                    value={formData.type}
                                    label="Tipo"
                                    name="type"
                                    onChange={handleChange}
                                    disabled={open === 'VIEW'}
                                >
                                    <MenuItem value="FECHA">FECHA</MenuItem>
                                    <MenuItem value="PRODUCTO">PRODUCTO</MenuItem>
                                    <MenuItem value="PROVEEDOR">PROVEEDOR</MenuItem>
                                    <MenuItem value="MONTO">MONTO</MenuItem>
                                    <MenuItem value="TIPO">TIPO COMPRA</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Desde"
                                            value={new Date(formData.from)}
                                            onChange={value => handleChange({
                                                target: {
                                                    name: 'from',
                                                    value: new Date(value.toISOString())
                                                }
                                            })}
                                            disabled={open === 'VIEW'}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Hasta"
                                            value={new Date(formData.to)}
                                            onChange={value => handleChange({
                                                target: {
                                                    name: 'to',
                                                    value: new Date(value.toISOString())
                                                }
                                            })}
                                            disabled={open === 'VIEW'}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Box>
                            <FormControl>
                                <TextField
                                    type="number"
                                    label="Valor (%) *"
                                    variant="outlined"
                                    id="value"
                                    name="value"
                                    value={formData.value}
                                    disabled={open === 'VIEW'}
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    type="number"
                                    label="Base *"
                                    variant="outlined"
                                    id="base"
                                    name="base"
                                    value={formData.base}
                                    disabled={open === 'VIEW' || formData.type !== 'MONTO'}
                                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel id="supplier-select">Proveedor *</InputLabel>
                                <Select
                                    labelId="supplier-select"
                                    id="supplier_id"
                                    value={formData.supplier_id}
                                    label="Proveedor"
                                    name="supplier_id"
                                    onChange={handleChange}
                                    disabled={open === 'VIEW' || formData.type !== 'PROVEEDOR'}
                                >
                                    {state.suppliers.data.map(s => (
                                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                    ))}
                                </Select>
                                {errors.supplier_id?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El proveedor es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginTop: 3,
                                width: '50%'
                            }}>
                                <Button type="button" variant="outlined" onClick={reset} sx={{ width: '50%' }}>
                                    Cancelar
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
                        Confirmar eliminación de cliente
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