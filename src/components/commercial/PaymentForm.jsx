import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

export function PaymentForm({
    handleSubmit,
    handleChange,
    handleCloseSale,
    validate,
    formData,
    reset,
    setOpen,
    disabled,
    setDisabled,
    errors
}) {
    return (
        <form onSubmit={e => handleSubmit(e, validate, formData, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingX: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <FormControl sx={{ width: '33%' }}>
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
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel id="type-select">Tipo</InputLabel>
                        <Select
                            labelId="type-select"
                            id="type"
                            value={formData.type}
                            label="Proveedor"
                            name="type"
                            sx={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                            <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                            <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '33%' }}>
                        <InputLabel id="amount">Importe</InputLabel>
                        <Input
                            id="amount"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                        {errors.amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El importe es requerido.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <FormControl>
                    <InputLabel id="observations">Observaciones</InputLabel>
                    <Input
                        id="observations"
                        name="observations"
                        value={formData.observations}
                        onChange={handleChange}
                    />
                    {errors.observations?.type === 'maxLength' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * Las observaciones son demasiado largas.
                        </Typography>
                    }
                </FormControl>
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
                    <Button type="button" variant="outlined" sx={{ width: '33%' }} onClick={() => {
                        handleCloseSale()
                        reset(setOpen)
                    }}>
                        Cerrar
                    </Button>
                    <Button type="button" variant="outlined" sx={{ width: '33%' }} onClick={() => reset(setOpen)}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                        sx={{ width: '33%' }}
                    >
                        Guardar
                    </Button>
                </FormControl>
            </Box>
        </form >
    )
}