import { useContext, useEffect, useState } from "react";
import { FormControl, Input, InputLabel } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useSuppliers } from "../../hooks/useSuppliers";

export function SupplierFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getSuppliers } = useSuppliers()

    const [filter, setFilter] = useState({ name: '', loaded: false })

    const handleChange = e => {
        setFilter({
            ...filter,
            laoded: true,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (filter.name.length > 0) {
            dispatch({
                type: 'SUPPLIERS',
                payload: {
                    ...state.suppliers,
                    filters: `&name=${filter.name}`
                }
            })
        } else if (filter.loaded) {
            getSuppliers(`?page=${state.clients.page}&offset=${state.clients.offset}`)
        }
    }, [filter])

    return (
        <FormControl>
            <InputLabel htmlFor="name">Nombre</InputLabel>
            <Input id="name" type="text" name="name" value={filter.name} onChange={handleChange} />
        </FormControl>
    )
}