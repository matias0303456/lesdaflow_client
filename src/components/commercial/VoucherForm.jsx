/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"

import { useVouchers } from "../../hooks/useVouchers"

export function VoucherForm({
    sale,
    handleCloseSale,
    resetSale,
    setOpenSale
}) {

    const { getArcaData, arcaData, voucherFormData, createVoucher } = useVouchers()
    const { formData, setFormData, reset, disabled, setDisabled, validate, errors, handleChange } = voucherFormData

    useEffect(() => {
        getArcaData()
    }, [])

    useEffect(() => {
        setFormData({
            ...formData,
            total: sale.total,
            sale_id: sale.id
        })
    }, [sale])

    return (
        <form onSubmit={e => createVoucher(e, validate, formData, reset, setDisabled)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel id="voucher_type-select">Tipo Cbte.</InputLabel>
                        <Select
                            labelId="voucher_type-select"
                            id="voucher_type"
                            value={formData.voucher_type}
                            label="Tipo Cbte."
                            name="voucher_type"
                            sx={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            {arcaData.voucher_types.map((item) => (
                                <MenuItem key={item.Id} value={item.Id}>{item.Desc}</MenuItem>
                            ))}
                        </Select>
                        {errors.type?.voucher_type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El tipo de comprobante es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel id="sales_point-select">Punto Vta.</InputLabel>
                        <Select
                            labelId="sales_point-select"
                            id="sales_point"
                            value={formData.sales_point}
                            label="Punto Vta."
                            name="sales_point"
                            sx={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            {arcaData.sales_points.map((item) => (
                                <MenuItem key={item.Nro} value={item.Nro}>{item.Nro}</MenuItem>
                            ))}
                        </Select>
                        {errors.type?.sales_point === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El punto de venta es requerido.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel id="document_type-select">Tipo Doc.</InputLabel>
                        <Select
                            labelId="document_type-select"
                            id="document_type"
                            value={formData.document_type}
                            label="Tipo Doc."
                            name="document_type"
                            sx={{ width: '100%' }}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Seleccione</MenuItem>
                            {arcaData.document_types.map((item) => (
                                <MenuItem key={item.Id} value={item.Id}>{item.Desc}</MenuItem>
                            ))}
                        </Select>
                        {errors.type?.document_type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El tipo de documento es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel htmlFor="document_number">Nro. documento</InputLabel>
                        <Input
                            id="document_number"
                            type="text"
                            name="document_number"
                            value={formData.document_number}
                            onChange={handleChange}
                        />
                        {errors.type?.document_number === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El número de documento es requerido.
                            </Typography>
                        }
                    </FormControl>
                </Box>
                <FormControl>
                    <TextField
                        label="Total"
                        id="total"
                        type="number"
                        onChange={handleChange}
                        name="total"
                        value={formData.total}
                        InputProps={{ inputProps: { step: 0.01 } }}
                    />
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
                        resetSale(setOpenSale)
                        reset()
                    }}>
                        Cerrar
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ width: '33%' }}
                        onClick={() => {
                            resetSale(setOpenSale)
                            reset()
                        }}
                    >
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
        </form>
    )
}