/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { DataContext } from "../../providers/DataProvider";

import { ModalComponent } from "../common/ModalComponent";

import { REPORT_URL } from "../../utils/urls";

export function FirstSection({
    formData,
    handleChange,
    setNewSettlement,
    calculations,
    openSettlement,
    setOpenSettlement,
    handleCloseSettlement,
    createSettlement
}) {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    return (
        <Box className="w-[100%]" sx={{ backgroundColor: '#fff' }}>
            <Typography
                variant="h6"
                sx={{
                    width: "100%",
                    fontSize: "14px",
                    color: "white",
                    paddingX: "10px",
                    paddingY: "5px",
                    backgroundColor: "#078BCD",
                    borderRadius: "2px",
                    fontWeight: "bold",
                }}
            >
                Filtros
            </Typography>
            <form className="mb-3">
                <Box sx={{ display: "flex", alignItems: "end", justifyContent: "start", gap: 2, padding: 2 }}>
                    <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Inicio período"
                                value={new Date(formData.from)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'from',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl variant="standard" sx={{ width: "16.5%", color: "#59656b" }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha"
                                value={new Date(formData.to)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'to',
                                        value: new Date(value.toISOString())
                                    }
                                })}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl
                        variant="standard"
                        sx={{
                            width: "20%",
                            color: "#59656b",
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center"
                        }}
                    >
                        <InputLabel>Vendedor</InputLabel>
                        <Select
                            labelId="seller-select"
                            id="user"
                            value={auth?.user.role === 'ADMINISTRADOR' ? formData.user : auth?.user.id}
                            disabled={auth?.user.role !== 'ADMINISTRADOR'}
                            label="Vendedor"
                            name="user"
                            onChange={handleChange}
                            sx={{ width: "100%" }}
                        >
                            {auth?.user.role === 'ADMINISTRADOR' ? (
                                [
                                    <MenuItem value="" key="select">Seleccione</MenuItem>,
                                    ...(state.users.data.filter(u => u.role === 'VENDEDOR').length > 0
                                        ? state.users.data.filter(u => u.role === 'VENDEDOR').map((u) => (
                                            <MenuItem key={u.id} value={u.id}>
                                                {`${u.name}`.toUpperCase()}
                                            </MenuItem>
                                        ))
                                        : [<MenuItem key="no-results">No se encontraron resultados</MenuItem>])
                                ]
                            ) : (
                                <MenuItem value={auth?.user.id} key={auth?.user.id}>
                                    {`${auth?.user.name}`.toUpperCase()}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color='error'
                        disabled={formData.user.toString().length === 0}
                        onClick={() => {
                            const { user, from, to } = formData
                            const user_id = auth?.user.role === 'ADMINISTRADOR' ? user : auth?.user.id
                            window.open(`${REPORT_URL}/calculate-commissions?token=${auth?.token}&user_id=${user_id}&from=${from.toISOString()}&to=${to.toISOString()}`, '_blank')
                        }}>
                        PDF
                    </Button>
                    {auth?.user.role === 'ADMINISTRADOR' &&
                        <Button
                            variant="contained"
                            disabled={formData.user.toString().length === 0}
                            onClick={() => {
                                setNewSettlement({
                                    seller: calculations.seller,
                                    total_cta_cte: calculations['CUENTA_CORRIENTE'].total.replace('$', ''),
                                    commission_cta_cte: calculations['CUENTA_CORRIENTE'].commission.replace('$', ''),
                                    last_cta_cte_value: calculations['CUENTA_CORRIENTE'].last_cta_cte_value,
                                    total_contado: calculations['CONTADO'].total.replace('$', ''),
                                    commission_contado: calculations['CONTADO'].commission.replace('$', ''),
                                    last_contado_value: calculations['CONTADO'].last_contado_value,
                                    total_poxipol: calculations['POXIPOL'].total.replace('$', ''),
                                    commission_poxipol: calculations['POXIPOL'].commission.replace('$', ''),
                                    last_poxipol_value: calculations['POXIPOL'].last_poxipol_value,
                                    sales: [
                                        ...calculations['CUENTA_CORRIENTE'].sales.map(s => s.id),
                                        ...calculations['CONTADO'].sales.map(s => s.id),
                                        ...calculations['POXIPOL'].sales.map(s => s.id)
                                    ]
                                })
                                setOpenSettlement('NEW')
                            }}>
                            Liquidar
                        </Button>
                    }
                </Box>
            </form>
            <ModalComponent open={openSettlement === 'NEW'} onClose={handleCloseSettlement}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Liquidar comisiones
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button type="button" variant="outlined" onClick={handleCloseSettlement} sx={{ width: '35%' }}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ width: '35%' }}
                        onClick={() => createSettlement()}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
        </Box>
    )
}