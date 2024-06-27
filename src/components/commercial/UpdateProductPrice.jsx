import { useState } from "react";
import { Box, Button, Input, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material"

import { ModalComponent } from "../ModalComponent"

import { getNewCostAndEarnPrice, getNewPrice } from "../../utils/helpers"

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function UpdateProductPrice({
    open,
    massiveEdit,
    reset,
    setMassiveEdit,
    setOpen,
    handleSubmitMassive,
    handleUpdateCostAndEarn,
    setDisabled
}) {

    const [value, setValue] = useState(0)
    const [massiveEditPercentage, setMassiveEditPercentage] = useState(0)
    const [massiveEditValue, setMassiveEditValue] = useState(0)
    const [massiveEditEarn, setMassiveEditEarn] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
        setMassiveEditPercentage(0)
        setMassiveEditValue(0)
        setMassiveEditEarn(0)
    };

    return (
        <ModalComponent open={open === 'MASSIVE-EDIT'} dynamicContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Actualización de precios
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Producto</TableCell>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Proveedor</TableCell>
                            <TableCell align="center">Precio actual</TableCell>
                            <TableCell align="center">Precio nuevo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {massiveEdit.map(me => (
                            <TableRow
                                key={me.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{me.details}</TableCell>
                                <TableCell align="center">{me.code}</TableCell>
                                <TableCell align="center">{me.supplier_name}</TableCell>
                                <TableCell align="center">${(me.buy_price + ((me.buy_price / 100) * me.earn)).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    ${value === 0 ?
                                        getNewPrice(me, massiveEditPercentage) :
                                        getNewCostAndEarnPrice(me, massiveEditValue, massiveEditEarn)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Porcentual" {...a11yProps(0)} />
                    <Tab label="Por costo y ganancia" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    marginTop: 2,
                    marginBottom: 3
                }}>
                    <Typography variant="h6">
                        Porcentaje
                    </Typography>
                    <Input
                        type="number"
                        value={massiveEditPercentage}
                        onChange={e => setMassiveEditPercentage(e.target.value)}
                    />
                    <Typography variant="h6">
                        %
                    </Typography>
                </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center'
                    }}>
                        <Typography variant="h6">
                            Costo
                        </Typography>
                        <Input
                            type="number"
                            value={massiveEditValue}
                            onChange={e => setMassiveEditValue(e.target.value)}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center'
                    }}>
                        <Typography variant="h6">
                            Ganancia
                        </Typography>
                        <Input
                            type="number"
                            value={massiveEditEarn}
                            onChange={e => setMassiveEditEarn(e.target.value)}
                        />
                        <Typography variant="h6">
                            %
                        </Typography>
                    </Box>
                </Box>
            </CustomTabPanel>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'center',
                width: '60%',
                margin: '0 auto'
            }}>
                <Button type="button" variant="outlined"
                    sx={{ width: '50%' }}
                    onClick={() => {
                        reset(setOpen)
                        setMassiveEdit([])
                        setMassiveEditPercentage(0)
                    }}
                >
                    Cancelar
                </Button>
                <Button type="submit" variant="contained"
                    sx={{ width: '50%' }}
                    onClick={
                        () => value === 0 ?
                            handleSubmitMassive(
                                massiveEdit,
                                massiveEditPercentage,
                                reset,
                                setMassiveEdit,
                                setMassiveEditPercentage,
                                setDisabled
                            ) :
                            handleUpdateCostAndEarn(
                                massiveEdit,
                                setMassiveEdit,
                                massiveEditValue,
                                setMassiveEditValue,
                                massiveEditEarn,
                                setMassiveEditEarn,
                                reset,
                                setDisabled
                            )
                    }
                >
                    Guardar
                </Button>
            </Box>
        </ModalComponent>
    )
}