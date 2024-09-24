/* eslint-disable react/prop-types */
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { es } from "date-fns/locale"

export function LoanForm({
    handleChange,
    handleSubmit,
    clients,
    formData,
    errors,
    validate,
    reset,
    disabled,
    setDisabled,
    handleClose
}) {
    return (
        <form onChange={handleChange} onSubmit={e => handleSubmit(e, formData, validate, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <Autocomplete
                            disablePortal
                            options={clients.map(c => ({ id: c.id, label: `${c.first_name} ${c.last_name}` }))}
                            renderInput={(params) => <TextField {...params} label="Cliente" />}
                            name="client_id"
                            value={formData.client_id?.toString().length > 0 ? `${clients.find(c => c.id === formData.client_id)?.first_name} ${clients.find(c => c.id === formData.client_id)?.last_name}` : ''}
                            onChange={(_, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                            isOptionEqualToValue={(option, value) => formData.client_id?.toString().length === 0 || value === option.label}
                        />
                        {errors.client_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El cliente es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
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
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
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
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                        {errors.amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El monto es requerido.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Interés"
                            variant="outlined"
                            id="interest"
                            name="interest"
                            InputProps={{ inputProps: { step: 0.01 } }}
                            value={formData.interest}
                            onChange={e => handleChange({
                                target: {
                                    name: 'interest',
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                        {errors.interest?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El interés es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Cant. pagos"
                            variant="outlined"
                            id="payments_amount"
                            name="payments_amount"
                            InputProps={{ inputProps: { step: 1 } }}
                            value={formData.payments_amount}
                            onChange={e => handleChange({
                                target: {
                                    name: 'payments_amount',
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                        {errors.payments_amount?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La cantidad de pagos es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <TextField
                            type="number"
                            label="Interés por mora"
                            variant="outlined"
                            id="late_fee"
                            name="late_fee"
                            InputProps={{ inputProps: { step: 0.01 } }}
                            value={formData.late_fee}
                            onChange={e => handleChange({
                                target: {
                                    name: 'late_fee',
                                    value: Math.abs(parseInt(e.target.value))
                                }
                            })}
                        />
                        {errors.late_fee?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El interés por mora es requerido.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, sm: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', sm: '32%' } }}>
                        <InputLabel id="payments_frequency">Frecuencia pagos</InputLabel>
                        <Input
                            type="text"
                            disabled
                            value={formData.payments_frequency}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', sm: '65%' } }}>
                        <InputLabel id="observations">Observaciones</InputLabel>
                        <Input
                            id="observations"
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
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleClose}
                        sx={{ width: { xs: '50%', sm: '35%' } }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={disabled}
                        sx={{ width: { xs: '50%', sm: '35%' }, color: '#FFF' }}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </form>
    )
}