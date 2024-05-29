import { useContext, useEffect, useState } from "react";
import { FormControl, Input, InputLabel } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useRegisters } from "../../hooks/useRegisters";

export function RegisterFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getRegisters } = useRegisters()

    const [filter, setFilter] = useState({ user: '' })

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (filter.user.length > 0) {
            dispatch({
                type: 'REGISTERS',
                payload: {
                    ...state.registers,
                    filters: `&user=${filter.user}`
                }
            })
        } else if (filter.loaded) {
            getRegisters(`?page=${state.registers.page}&offset=${state.registers.offset}`)
        }
    }, [filter])

    return (
        <FormControl>
            <InputLabel htmlFor="user">Caja</InputLabel>
            <Input id="user" type="text" name="user" value={filter.user} onChange={handleChange} />
        </FormControl>
    )
}