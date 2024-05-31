import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useRegisters } from "../../hooks/useRegisters";

export function RegisterFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getRegisters } = useRegisters()

    const handleChange = e => {
        dispatch({
            type: 'REGISTERS',
            payload: {
                ...state.registers,
                filter_fields: {
                    ...state.registers.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'REGISTERS',
            payload: {
                ...state.registers,
                filter_fields: { user: '', loaded: false },
                filters: ''
            }
        })
    }

    useEffect(() => {
        const { user, loaded } = state.registers.filter_fields
        if (user.length > 0) {
            dispatch({
                type: 'REGISTERS',
                payload: {
                    ...state.registers,
                    filters: `&user=${user}`
                }
            })
        } else if (loaded) {
            getRegisters(`?page=${state.registers.page}&offset=${state.registers.offset}`)
        }
    }, [state.registers.filter_fields])

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl>
                <InputLabel htmlFor="user">Caja</InputLabel>
                <Input
                    id="user"
                    type="text"
                    name="user"
                    value={state.registers.filter_fields.user}
                    onChange={handleChange}
                />
            </FormControl>
            <Button type="button" variant="outlined" onClick={handleReset}>
                Reiniciar filtro
            </Button>
        </Box>
    )
}