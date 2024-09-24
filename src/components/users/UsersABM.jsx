/* eslint-disable react/prop-types */
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function UsersABM({
    formData,
    handleChange,
    handleSubmit,
    validate,
    reset,
    errors,
    open,
    setOpen,
    disabled,
    setDisabled,
    showPassword,
    setShowPassword
}) {
    return (
        <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 1 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 3, md: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="first_name">Nombre *</InputLabel>
                        <Input id="first_name" type="text" name="first_name" value={formData.first_name} disabled={open === 'VIEW'} />
                        {errors.first_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es requerido.
                            </Typography>
                        }
                        {errors.first_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="last_name">Apellido *</InputLabel>
                        <Input id="last_name" type="text" name="last_name" value={formData.last_name} disabled={open === 'VIEW'} />
                        {errors.last_name?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es requerido.
                            </Typography>
                        }
                        {errors.last_name?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="username">Usuario *</InputLabel>
                        <Input id="username" type="text" name="username" value={formData.username} disabled={open === 'VIEW' || open === 'EDIT'} />
                        {errors.username?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El usuario es requerido.
                            </Typography>
                        }
                        {errors.username?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El usuario es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Contraseña *"
                            variant="outlined"
                            id="password"
                            name="password"
                            value={formData.password}
                            disabled={open === 'VIEW'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errors.password?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es requerida.
                            </Typography>
                        }
                        {errors.password?.type === "minLength" && (
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado corta.
                            </Typography>
                        )}
                        {errors.password?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 3, md: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha nacimiento"
                                value={new Date(formData.birth)}
                                disabled={open === 'VIEW'}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'birth',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel id="type-select">Tipo documento</InputLabel>
                        <Select
                            labelId="type-select"
                            id="document_type"
                            value={formData.document_type}
                            label="Tipo documento"
                            name="document_type"
                            disabled={open === 'VIEW'}
                            onChange={handleChange}
                        >
                            <MenuItem value="DNI">DNI</MenuItem>
                            <MenuItem value="LE">LE</MenuItem>
                            <MenuItem value="CUIL">CUIL</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="document_number">Nro. documento / CUIT</InputLabel>
                        <Input id="document_number" type="text" name="document_number" value={formData.document_number} disabled={open === 'VIEW'} />
                        {errors.document_number?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El número de documento es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="local_phone">Teléfono</InputLabel>
                        <Input id="local_phone" type="number" name="local_phone" value={formData.local_phone} disabled={open === 'VIEW'} />
                        {errors.local_phone?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El teléfono es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 1 } }}>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="cell_phone">Celular</InputLabel>
                        <Input id="cell_phone" type="number" name="cell_phone" value={formData.cell_phone} disabled={open === 'VIEW'} />
                        {errors.cell_phone?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El celular es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" type="text" name="email" value={formData.email} disabled={open === 'VIEW'} />
                        {errors.email?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El email es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                        <InputLabel htmlFor="address">Dirección</InputLabel>
                        <Input id="address" type="text" name="address" value={formData.address} disabled={open === 'VIEW'} />
                        {errors.address?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La dirección es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                </Box>
            </Box>
            <FormControl sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'center',
                margin: '0 auto',
                marginTop: 5,
                width: { xs: '100%', md: '50%' }
            }}>
                <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                    width: '50%'
                }}>
                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {(open === 'NEW' || open === 'EDIT') &&
                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                        width: '50%',
                        color: '#FFF'
                    }}>
                        Confirmar
                    </Button>
                }
            </FormControl>
        </form>
    )
}