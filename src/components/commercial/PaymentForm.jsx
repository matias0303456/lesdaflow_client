import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

import { useForm } from "../../hooks/useForm"

export function PaymentForm() {

    const { formData, validate, errors, disabled, handleChange } = useForm({
        defaultData: { date: '', type: 'EFECTIVO', amount: '', observations: '' },
        rules: {
            date: { required: true },
            amount: { required: true },
            observations: { maxLength: 255 }
        }
    })

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            console.log(formData)
        }
    }

    return (
        <form onChange={handleChange} onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', gap: 3 }}>
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
                        {errors.date?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La fecha es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="amount">Importe</InputLabel>
                        <Input
                            id="amount"
                            type="number"
                            name="amount"
                            value={formData.amount}
                        />
                        {errors.amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El importe es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel id="type-select">Tipo</InputLabel>
                        <Select
                            labelId="type-select"
                            id="type"
                            value={formData.type}
                            label="Proveedor"
                            name="type"
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                            <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                            <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                        <Input
                            id="observations"
                            type="text"
                            name="observations"
                            value={formData.observations}
                        />
                        {errors.observations?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las observaciones son demasiado largas.
                            </Typography>
                        }
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 3,
                    width: '50%'
                }}>
                    <Button type="button" variant="outlined">
                        Cerrar
                    </Button>
                    <Button type="button" variant="outlined">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                        sx={{ width: '50%' }}
                    >
                        Guardar
                    </Button>
                </FormControl>
            </Box>
        </form >
    )
}