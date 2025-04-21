/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { Box, Button, FormControl} from "@mui/material"

import { useVouchers } from "../../hooks/useVouchers"

export function VoucherForm({
    handleCloseSale,
    reset,
    setOpen,
    disabled
}) {

    const { getArcaData } = useVouchers()

    useEffect(() => {
        getArcaData()
    }, [])

    return (
        <form>
            {/* <FormControl sx={{ width: { xs: '50%', sm: '33%' } }}>
                <InputLabel id="type-select">Tipo</InputLabel>
                <Select
                    labelId="type-select"
                    id="type"
                    value={formData.type}
                    label="Proveedor"
                    name="type"
                    sx={{ width: '100%' }}
                >
                    <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                    <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                    <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                </Select>
            </FormControl> */}
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