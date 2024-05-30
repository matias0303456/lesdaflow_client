import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";

export function ClientFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getClients } = useClients()

    const [filter, setFilter] = useState({
        first_name: '',
        last_name: '',
        work_place: '',
        loaded: false
    })
    const [show, setShow] = useState(false)

    const handleChange = e => {
        setFilter({
            ...filter,
            loaded: true,
            [e.target.name]: e.target.value
        })
    }

    const handleReset = () => {
        setFilter({
            first_name: '',
            last_name: '',
            work_place: '',
            loaded: true
        })
    }

    const handleToggleShow = () => setShow(!show)

    useEffect(() => {
        const { first_name, last_name, work_place, loaded } = filter
        if (first_name.length > 0 || last_name.length > 0 || work_place.length > 0) {
            dispatch({
                type: 'CLIENTS',
                payload: {
                    ...state.clients,
                    filters: `&first_name=${first_name}&last_name=${last_name}&work_place=${work_place}`
                }
            })
        } else if (loaded) {
            getClients(`?page=${state.clients.page}&offset=${state.clients.offset}`)
        }
    }, [filter])

    return (
        <>
            {show ?
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                            <Input id="first_name" type="text" name="first_name" value={filter.first_name} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                            <Input id="last_name" type="text" name="last_name" value={filter.last_name} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="name">Comercio</InputLabel>
                            <Input id="work_place" type="text" name="work_place" value={filter.work_place} onChange={handleChange} />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button type="button" variant="outlined" onClick={handleReset}>
                            Reiniciar filtros
                        </Button>
                        <Button type="button" variant="outlined" onClick={handleToggleShow}>
                            Ocultar filtros
                        </Button>
                    </Box>
                </Box> :
                <Button type="button" variant="outlined" onClick={handleToggleShow}>
                    Mostrar filtros
                </Button>
            }
        </>
    )
}