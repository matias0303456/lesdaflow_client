/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { DataContext } from "../../providers/DataProvider";

import { ModalComponent } from "../common/ModalComponent";

import { REPORT_URL } from "../../utils/urls";
import { format } from "date-fns";

export function FirstSection({
    formData,
    handleChange,
    newSettlement,
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
                            disabled={
                                formData.user.toString().length === 0 ||
                                (
                                    calculations['CUENTA_CORRIENTE'].sales.length === 0 &&
                                    calculations['CONTADO'].sales.length === 0 &&
                                    calculations['POXIPOL'].sales.length === 0
                                )
                            }
                            onClick={() => {
                                setNewSettlement({
                                    seller: calculations.seller,
                                    from_date: calculations.from_date,
                                    to_date: calculations.to_date,
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
                <Typography variant="h6">
                    Liquidar comisiones
                </Typography>
                <Typography variant="body1">
                    Vendedor: {newSettlement.seller}
                </Typography>
                <Typography variant="body1">
                    Período: {format(new Date(newSettlement.from_date), 'dd/MM/yyyy')} - {format(new Date(newSettlement.to_date), 'dd/MM/yyyy')}
                </Typography>
                <TableContainer component={Paper} sx={{ width: '70%', m: 'auto', my: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center">CTA CTE</TableCell>
                                <TableCell align="center">CONTADO</TableCell>
                                <TableCell align="center">POXIPOL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">
                                    <Typography variant="body2">
                                        N° BOLETAS
                                    </Typography>
                                    <Typography variant="caption" color="#F00">
                                        (No podrán volver a editarse)
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {calculations['CUENTA_CORRIENTE'].sales.map(s => s.id).join(', ')}
                                </TableCell>
                                <TableCell align="center">
                                    {calculations['CONTADO'].sales.map(s => s.id).join(', ')}
                                </TableCell>
                                <TableCell align="center">
                                    {calculations['POXIPOL'].sales.map(s => s.id).join(', ')}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">TOTAL</TableCell>
                                <TableCell align="center">${newSettlement.total_cta_cte}</TableCell>
                                <TableCell align="center">${newSettlement.total_contado}</TableCell>
                                <TableCell align="center">${newSettlement.total_poxipol}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">PORC. COMISIÓN</TableCell>
                                <TableCell align="center">{newSettlement.last_cta_cte_value}%</TableCell>
                                <TableCell align="center">{newSettlement.last_contado_value}%</TableCell>
                                <TableCell align="center">{newSettlement.last_poxipol_value}%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="center">MONTO COMISIÓN</TableCell>
                                <TableCell align="center">${newSettlement.commission_cta_cte}</TableCell>
                                <TableCell align="center">${newSettlement.commission_contado}</TableCell>
                                <TableCell align="center">${newSettlement.commission_poxipol}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '50%', m: 'auto', mt: 4 }}>
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
        </Box >
    )
}