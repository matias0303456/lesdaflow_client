/* eslint-disable react/prop-types */
import { useContext } from "react"
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"

import { DataContext } from "../../providers/DataProvider"
import { AuthContext } from "../../providers/AuthProvider"

import { AddArticlesToSale } from "./AddArticlesToSale"
import { DataDisplay } from "./DataDisplay"

export function SaleFormFields({
    handleChange,
    confirmed,
    handleSubmit,
    formData,
    setFormData,
    validate,
    reset,
    setDisabled,
    setConfirmed,
    errors,
    saleArticles,
    setSaleArticles,
    missing,
    setMissing,
    idsToDelete,
    setIdsToDelete,
    handleClose,
    disabled,
    open,
    discAndSurch
}) {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    return (
        <Box sx={{ p: 1 }}>
            <form onChange={handleChange} onSubmit={(e) => {
                e.preventDefault();
                if (confirmed) {
                    handleSubmit(e, formData, validate, reset, setDisabled)
                    setConfirmed(false)
                } else {
                    setConfirmed(true)
                }
            }
            }>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <FormControl sx={{ width: { xs: '100%', md: '60%' } }}>
                            <Autocomplete
                                disablePortal
                                id="client-autocomplete"
                                value={formData.client_id.toString().length > 0 ? `${state.clients.find(c => c.id === formData.client_id)?.first_name} ${state.clients.find(c => c.id === formData.client_id)?.last_name}` : ''}
                                options={state.clients.map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c.id }))}
                                noOptionsText="No hay clientes registrados."
                                onChange={(e, value) => handleChange({ target: { name: 'client_id', value: value?.id ?? '' } })}
                                renderInput={(params) => <TextField {...params} label="Cliente *" />}
                                isOptionEqualToValue={(option, value) => option.code === value.code || value.length === 0}
                                disabled={open === 'VIEW'}
                            />
                            {errors.client_id?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El cliente es requerido.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl sx={{ width: { xs: '100%', md: '40%' } }}>
                            <InputLabel id="type-select">Tipo</InputLabel>
                            <Select
                                labelId="type-select"
                                id="type"
                                value={formData.type}
                                label="Tipo Comp."
                                name="type"
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                                <MenuItem value="CONTADO">CONTADO</MenuItem>
                                <MenuItem value="DEBITO">DEBITO</MenuItem>
                                <MenuItem value="CREDITO">CREDITO</MenuItem>
                                <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2
                    }}>
                        <AddArticlesToSale
                            articles={state.articles}
                            saleArticles={saleArticles}
                            setSaleArticles={setSaleArticles}
                            missing={missing}
                            setMissing={setMissing}
                            idsToDelete={idsToDelete}
                            setIdsToDelete={setIdsToDelete}
                            open={open}
                        />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: { xs: '100%', md: '40%' },
                            gap: 1
                        }}>
                            <DataDisplay data={discAndSurch} />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 3 }}>
                    <FormControl>
                        <InputLabel htmlFor="total">Total</InputLabel>
                        <Input value={formData.total} id="total" type="number" name="total" />
                    </FormControl>
                </Box>
                {confirmed &&
                    <Typography variant="body1" color="red" marginTop={2} align="center">
                        Confirme los datos de la boleta antes de guardar
                    </Typography>
                }
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 3,
                    width: '50%'
                }}>
                    <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '50%' }}>
                        {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {(open === 'NEW' || open === 'CONVERT' || (open === 'EDIT' && auth?.user.role === 'ADMINISTRADOR')) &&
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '50%' }}
                        >
                            {confirmed ? 'Guardar' : 'Confirmar'}
                        </Button>
                    }
                </FormControl>
            </form>
        </Box>
    )
}