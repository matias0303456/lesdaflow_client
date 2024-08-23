/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Input } from "@mui/material";
import { format } from 'date-fns';

import { AuthContext } from '../../providers/AuthProvider';

import { DataGridWithFrontendPagination } from '../datagrid/DataGridWithFrontendPagination';
import { ModalComponent } from '../common/ModalComponent';

export function SecondSection({
    formData,
    open,
    setOpen,
    commissions,
    handleCloseCommissions,
    newCommissionValue,
    setNewCommissionValue,
    newCommissionType,
    setNewCommissionType,
    newCommissionDate,
    setNewCommissionDate,
    handleSubmit
}) {

    const { auth } = useContext(AuthContext)

    const commissionsHeadCells = [
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha corte',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yyyy')
        },
        {
            id: 'value',
            numeric: false,
            disablePadding: true,
            label: 'Valor',
            accessor: (row) => `${row.value}%`
        },
    ]

    return (
        <Box className="w-[100%]">
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
                Valores
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'start', my: 1, mt: 2 }}>
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => setOpen('HISTORIC')}
                    disabled={formData.user.toString().length === 0}
                >
                    Ver histórico
                </Button>
                <FormControl sx={{ width: '10%' }}>
                    <InputLabel>Actual Cta. Cte.</InputLabel>
                    <Input
                        type="text"
                        value={`${commissions.filter(c => {
                            return new Date(c.date) < new Date(Date.now()) && c.type === 'CUENTA_CORRIENTE'
                        })[0]?.value ?? 0}%`}
                        disabled
                    />
                </FormControl>
                <FormControl sx={{ width: '10%' }}>
                    <InputLabel>Actual Contado</InputLabel>
                    <Input
                        type="text"
                        value={`${commissions.filter(c => {
                            return new Date(c.date) < new Date(Date.now()) && c.type === 'CONTADO'
                        })[0]?.value ?? 0}%`}
                        disabled
                    />
                </FormControl>
                <FormControl sx={{ width: '10%' }}>
                    <InputLabel>Actual Poxipol</InputLabel>
                    <Input
                        type="text"
                        value={`${commissions.filter(c => {
                            return new Date(c.date) < new Date(Date.now()) && c.type === 'POXIPOL'
                        })[0]?.value ?? 0}%`}
                        disabled
                    />
                </FormControl>
            </Box>
            <ModalComponent open={open === 'HISTORIC'} onClose={handleCloseCommissions} reduceWidth={100}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {`Historial de comisiones - ${commissions[0]?.user?.name ?? ''}`}
                    </Typography>
                    {auth?.user.role === 'ADMINISTRADOR' &&
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'start', justifyContent: 'end' }}>
                            <FormControl sx={{ width: '30%' }}>
                                <InputLabel htmlFor="current">Nuevo valor</InputLabel>
                                <Input
                                    type="number"
                                    id="value"
                                    name="value"
                                    value={newCommissionValue}
                                    onChange={e => setNewCommissionValue(Math.abs(e.target.value))}
                                />
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
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    labelId="type-select"
                                    id="type"
                                    value={newCommissionType}
                                    disabled={newCommissionValue <= 0}
                                    label="Tipo"
                                    name="type"
                                    onChange={(e) => setNewCommissionType(e.target.value)}
                                    sx={{ width: "100%" }}
                                >
                                    <MenuItem value="CUENTA_CORRIENTE">
                                        CTA CTE
                                    </MenuItem>
                                    <MenuItem value="CONTADO">
                                        CONTADO
                                    </MenuItem>
                                    <MenuItem value="POXIPOL">
                                        POXIPOL
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: "30%", color: "#59656b" }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha de corte"
                                        value={new Date(newCommissionDate)}
                                        disabled={newCommissionValue <= 0}
                                        onChange={value => setNewCommissionDate(new Date(value.toISOString()))}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <Button
                                variant="outlined"
                                sx={{ width: '20%' }}
                                disabled={newCommissionValue <= 0}
                                onClick={(e) => handleSubmit(e, {
                                    user_id: formData.user,
                                    value: newCommissionValue,
                                    date: newCommissionDate,
                                    type: newCommissionType
                                })}
                            >
                                Agregar
                            </Button>
                        </Box>
                    }
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', my: 2, gap: 1 }}>
                    <Box sx={{ width: { xs: '100%', lg: '32.7%' } }}>
                        <Typography align="center">CUENTA CORRIENTE</Typography>
                        <DataGridWithFrontendPagination
                            headCells={commissionsHeadCells}
                            rows={commissions.filter(c => c.type === 'CUENTA_CORRIENTE')}
                            defaultOrderBy="date"
                            minWidth={0}
                            labelRowsPerPage="Reg. Página"
                        />
                    </Box>
                    <Box sx={{ width: { xs: '100%', lg: '32.7%' } }}>
                        <Typography align="center">CONTADO</Typography>
                        <DataGridWithFrontendPagination
                            headCells={commissionsHeadCells}
                            rows={commissions.filter(c => c.type === 'CONTADO')}
                            defaultOrderBy="date"
                            minWidth={0}
                            labelRowsPerPage="Reg. Página"
                        />
                    </Box>
                    <Box sx={{ width: { xs: '100%', lg: '32.7%' } }}>
                        <Typography align="center">POXIPOL</Typography>
                        <DataGridWithFrontendPagination
                            headCells={commissionsHeadCells}
                            rows={commissions.filter(c => c.type === 'POXIPOL')}
                            defaultOrderBy="date"
                            minWidth={0}
                            labelRowsPerPage="Reg. Página"
                        />
                    </Box>
                </Box>
                <Button variant="outlined" onClick={handleCloseCommissions} sx={{ float: 'right' }}>
                    Cerrar
                </Button>
            </ModalComponent>
        </Box>
    )
}