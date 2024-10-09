/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

import { useForm } from "../../hooks/useForm"
import { useQuery } from "../../hooks/useQuery"

import { SETTINGS_URL } from "../../utils/urls"
import { STATUS_CODES } from "../../utils/constants"
import { useContext } from "react"
import { MessageContext } from "../../providers/MessageProvider"

export function Settings({ defaultData, user, setUser, setValueTab }) {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleQuery } = useQuery()
    const { formData, handleChange, disabled, setDisabled, reset } = useForm({
        defaultData,
        rules: {}
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { status, data } = await handleQuery({
            url: `${SETTINGS_URL}/${formData.id}`,
            method: 'PUT',
            body: formData
        })
        if (status === STATUS_CODES.OK) {
            setUser({ ...user, settings: data })
            setMessage('Configuración cambiada correctamente.')
            setSeverity('success')
            setValueTab(0)
            reset()
        } else {
            setMessage(data.message)
            setSeverity('error')
            setDisabled(false)
        }
        setOpenMessage(true)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 1 } }}>
                <FormControl sx={{ width: { xs: '100%', md: '23%' }, mb: 1 }}>
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
                                value: Math.abs(parseFloat(e.target.value))
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', md: '23%' } }}>
                    <InputLabel id="type-select">Tipo</InputLabel>
                    <Select
                        labelId="type-select"
                        id="type"
                        label="Tipo"
                        value={formData.late_fee_type}
                        name="late_fee_type"
                        sx={{ width: '100%' }}
                        onChange={handleChange}
                    >
                        <MenuItem value="NOMINAL">NOMINAL</MenuItem>
                        <MenuItem value="PORCENTUAL">PORCENTUAL</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 5,
                    width: { xs: '100%', md: '50%' }
                }}
            >
                <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                        setValueTab(0)
                        reset()
                    }}
                    sx={{ width: '50%' }}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                    sx={{ width: '50%', color: '#FFF' }}
                >
                    Confirmar
                </Button>
            </FormControl>
        </form>
    )
}