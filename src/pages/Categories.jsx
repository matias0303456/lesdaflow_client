import { useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, LinearProgress, Typography } from "@mui/material";

import { DataGrid } from "../components/DataGrid";
import { Layout } from "../components/Layout";
import { useApi } from "../hooks/useApi";
import { ModalComponent } from '../components/ModalComponent'
import { useForm } from "../hooks/useForm";

import { CATEGORY_URL } from "../utils/urls";

export function Categories() {

    const { get, post, put, destroy } = useApi(CATEGORY_URL)

    const [open, setOpen] = useState(null)
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: { id: '', name: '' },
        rules: { name: { required: true, maxLength: 55 } }
    })

    useEffect(() => {
        (async () => {
            const { status, data } = await get()
            if (status === 200) {
                setCategories(data)
                setLoading(false)
            }
        })()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setCategories([data, ...categories])
                } else {
                    setCategories([data, ...categories.filter(cat => cat.id !== formData.id)])
                }
                reset(setOpen)
            } else {
                setDisabled(false)
            }
        }
    }

    async function handleDelete(elements) {
        setLoading(true)
        const result = await Promise.all(elements.map(e => destroy(e)))
        if (result.every(r => r.status === 200)) {
            const ids = result.map(r => r.data.id)
            setCategories([...categories.filter(cat => !ids.includes(cat.id))])
        } else {
            console.log('error')
        }
        setLoading(false)
        setOpen(null)
    }

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
            accessor: 'id'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
    ]

    return (
        <Layout title="Categorías">
            {loading || disabled ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGrid
                    title="Categorías de artículos"
                    headCells={headCells}
                    rows={categories}
                    open={open}
                    setOpen={setOpen}
                    data={formData}
                    setData={setFormData}
                    handleDelete={handleDelete}
                >
                    <ModalComponent open={open === 'NEW' || open === 'EDIT'} onClose={() => reset(setOpen)}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            {`${open === 'NEW' ? 'Nueva' : 'Editar'} categoría`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <InputLabel htmlFor="name">Nombre</InputLabel>
                                    <Input id="name" type="text" name="name" value={formData.name} />
                                    {errors.name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * Este campo es requerido.
                                        </Typography>
                                    }
                                    {errors.name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'center',
                                    marginTop: 1
                                }}>
                                    <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                                        width: '50%'
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Guardar
                                    </Button>
                                </FormControl>
                            </Box>
                        </form>
                    </ModalComponent>
                </DataGrid>
            }
        </Layout>
    )
}