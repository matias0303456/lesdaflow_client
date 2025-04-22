/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select } from "@mui/material"

import { useVouchers } from "../../hooks/useVouchers"

export function VoucherForm({
    sale,
    handleCloseSale,
    reset,
    setOpen,
    disabled
}) {

    const { getArcaData, arcaData, voucherFormData } = useVouchers()
    const { formData } = voucherFormData

    useEffect(() => {
        getArcaData()
    }, [])

    return (
        <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <InputLabel id="type-select">Tipo Cbte.</InputLabel>
                    <Select
                        labelId="type-select"
                        id="type"
                        value={formData.type}
                        label="Proveedor"
                        name="type"
                        sx={{ width: '100%' }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {arcaData.voucher_types.map((item) => (
                            <MenuItem key={item.Id} value={item.Id}>{item.Desc}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="sales_point-select">Punto Vta.</InputLabel>
                    <Select
                        labelId="sales_point-select"
                        id="sales_point"
                        value={formData.sale_point}
                        label="Punto Vta."
                        name="sales_point"
                        sx={{ width: '100%' }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {arcaData.sales_points.map((item) => (
                            <MenuItem key={item.Nro} value={item.Nro}>{item.Nro}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="document_type-select">Tipo Doc.</InputLabel>
                    <Select
                        labelId="document_type-select"
                        id="document_type"
                        value={formData.document_type}
                        label="Tipo Doc."
                        name="document_type"
                        sx={{ width: '100%' }}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {arcaData.document_types.map((item) => (
                            <MenuItem key={item.Id} value={item.Id}>{item.Desc}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ mt: 2 }}>
                    <InputLabel id="amount">Total</InputLabel>
                    <Input value={sale.total} disabled />
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