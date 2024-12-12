import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useSpendings } from "../hooks/useSpendings";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { LoginForm } from "../components/common/LoginForm";

export function Spendings() {

    const { auth } = useContext(AuthContext)

    const {
        loadingSpendings,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getSpendings,
        spendings,
        filter,
        setFilter,
        count,
        total,
        getTotal,
        headCells
    } = useSpendings()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            date: new Date(Date.now()),
            amount: '',
            description: ''
        },
        rules: {
            amount: {
                required: true
            },
            description: {
                required: true,
                maxLength: 191
            }
        }
    })

    useEffect(() => {
        if (auth) getTotal()
    }, [])

    useEffect(() => {
        const { page, offset } = filter
        getSpendings(`?page=${page}&offset=${offset}`)
    }, [filter])

    const handleClose = () => {
        reset(setOpen)
    }

    return (
        <>
            {auth ?
                <Layout title="Gastos">
                    {loadingSpendings ?
                        <Box sx={{ width: '100%', m: 1 }}>
                            <LinearProgress />
                        </Box> :
                        <Box sx={{ m: 1 }}>
                            <DataGridWithBackendPagination
                                headCells={headCells}
                                rows={spendings}
                                setOpen={setOpen}
                                setFormData={setFormData}
                                filter={filter}
                                setFilter={setFilter}
                                count={count}
                                showEditAction
                                showDeleteAction
                                contentHeader={
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                                        <Button variant="outlined" onClick={() => {
                                            reset()
                                            setOpen('NEW')
                                        }}>
                                            Agregar
                                        </Button>
                                        <Typography variant="h6">
                                            Total: {total}
                                        </Typography>
                                    </Box>
                                }
                            >
                                <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={handleClose} reduceWidth={900}>
                                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                        {open === "NEW" && "Nuevo gasto"}
                                        {open === "EDIT" && "Editar gasto"}
                                    </Typography>
                                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: { xs: '100%', sm: '60%' }, m: '0 auto' }}>
                                            <FormControl>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                    <DatePicker
                                                        label="Fecha"
                                                        value={new Date(formData.date)}
                                                        onChange={value => handleChange({
                                                            target: {
                                                                name: 'date',
                                                                value: new Date(value.toISOString())
                                                            }
                                                        })}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                            <FormControl>
                                                <TextField
                                                    type="number"
                                                    label="Monto"
                                                    variant="outlined"
                                                    id="amount"
                                                    name="amount"
                                                    InputProps={{ inputProps: { step: 0.01 } }}
                                                    value={formData.amount}
                                                    onChange={e => handleChange({
                                                        target: {
                                                            name: 'amount',
                                                            value: Math.abs(parseFloat(e.target.value))
                                                        }
                                                    })}
                                                />
                                                {errors.amount?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * El monto es requerido.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl>
                                                <InputLabel id="description">Descripción</InputLabel>
                                                <Input
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                                {errors.description?.type === 'required' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * La descripción es requerida.
                                                    </Typography>
                                                }
                                                {errors.description?.type === 'maxLength' &&
                                                    <Typography variant="caption" color="red" marginTop={1}>
                                                        * La descripción es demasiado larga.
                                                    </Typography>
                                                }
                                            </FormControl>
                                            <FormControl sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: 1,
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                marginTop: 3
                                            }}>
                                                <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '50%' }}>
                                                    Cancelar
                                                </Button>
                                                <Button type="submit" variant="contained" disabled={disabled} sx={{
                                                    width: '50%',
                                                    color: '#FFF'
                                                }}>
                                                    Confirmar
                                                </Button>
                                            </FormControl>
                                        </Box>
                                    </form>
                                </ModalComponent>
                                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                                    <Typography variant="h6" marginBottom={1} textAlign="center">
                                        Confirmar eliminación de gasto
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
                                            sx={{ width: '35%', color: '#FFF' }}
                                            onClick={() => handleDelete(formData, reset)}
                                        >
                                            Confirmar
                                        </Button>
                                    </Box>
                                </ModalComponent>
                            </DataGridWithBackendPagination>
                        </Box>
                    }
                </Layout> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Box>
                        <Typography variant="h6" align="center" marginBottom={3}>
                            Inicie sesión para usar el sistema
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}