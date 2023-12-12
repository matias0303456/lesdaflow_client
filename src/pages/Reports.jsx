import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from '../hooks/useForm'
import { useClients } from "../hooks/useClients";

import { Layout } from "../components/Layout";

import { REPORT_URL } from "../utils/urls";

export function Reports() {

    const { auth } = useContext(AuthContext)

    const { clients, loadingClients } = useClients()
    const { formData, handleChange } = useForm({
        defaultData: { client_id: '' },
        rules: { client_id: { required: true } }
    })

    const [canDownload, setCanDownload] = useState(false)

    useEffect(() => {
        setCanDownload(formData.client_id.toString().length > 0)
    }, [formData])

    return (
        <Layout title="Reportes">
            {loadingClients ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <Box>
                    <Box>
                        <Typography variant="h6" sx={{ marginTop: { xs: 3, sm: 0 } }}>
                            Movimientos de cliente
                        </Typography>
                        <Typography variant="caption" color="gray">
                            En este reporte se detallan los egresos y devoluciones vinculados al cliente seleccionado.
                        </Typography>
                        <form onChange={handleChange} style={{ marginTop: 10 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }} >
                                    <InputLabel id="client-select">Cliente</InputLabel>
                                    <Select
                                        labelId="client-select"
                                        id="category_id"
                                        value={formData.client_id}
                                        label="Cliente"
                                        name="client_id"
                                        onChange={handleChange}
                                    >
                                        {clients.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Link
                                    to={canDownload ? `${REPORT_URL}/client-movements/${auth.token}/${formData.client_id}` : '#'}
                                    target={canDownload ? "_blank" : '_self'}
                                    style={{ width: { xs: '30%', lg: '50%' }, cursor: canDownload ? 'pointer' : 'auto' }}
                                >
                                    <Button type="button" variant="contained" disabled={!canDownload}>
                                        Descargar PDF
                                    </Button>
                                </Link>
                            </Box>
                        </form>
                    </Box>
                </Box>
            }
        </Layout >
    )
}