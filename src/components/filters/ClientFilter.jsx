import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";

export function ClientFilter() {

    const { state, dispatch } = useContext(DataContext)

    const { getClients } = useClients()

    const [show, setShow] = useState(
        state.clients.filter_fields.first_name.length > 0 ||
        state.clients.filter_fields.last_name.length > 0 ||
        state.clients.filter_fields.work_place.length > 0
    )

    const handleChange = e => {
        dispatch({
            type: 'CLIENTS',
            payload: {
                ...state.clients,
                filter_fields: {
                    ...state.clients.filter_fields,
                    loaded: true,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    const handleReset = () => {
        dispatch({
            type: 'CLIENTS',
            payload: {
                ...state.clients,
                filter_fields: { first_name: '', last_name: '', work_place: '', loaded: false },
                filters: ''
            }
        })
    }

    const handleToggleShow = () => setShow(!show)

    useEffect(() => {
        const { first_name, last_name, work_place, loaded } = state.clients.filter_fields
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
    }, [state.clients.filter_fields])

    return (
        <>
            {show ?
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <InputLabel htmlFor="first_name">Nombre</InputLabel>
                            <Input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={state.clients.filter_fields.first_name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="last_name">Apellido</InputLabel>
                            <Input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={state.clients.filter_fields.last_name}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="name">Comercio</InputLabel>
                            <Input
                                id="work_place"
                                type="text"
                                name="work_place"
                                value={state.clients.filter_fields.work_place}
                                onChange={handleChange}
                            />
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