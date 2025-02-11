import { useContext, useMemo, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { DISCOUNT_URL } from "../utils/urls"
import { DataContext } from "../providers/DataProvider"
import { Box, Checkbox, FormControlLabel } from "@mui/material"

export function useDiscounts() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy } = useApi(DISCOUNT_URL)

    const [open, setOpen] = useState(null)
    const [loadingDiscounts, setLoadingDiscounts] = useState(true)

    async function getDiscounts(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'DISCOUNTS',
                payload: { ...state.discounts, data: data[0], count: data[1] }
            })
            setLoadingDiscounts(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'DISCOUNTS', payload: { ...state.discounts, data: [data, ...state.discounts.data] } })
                    setMessage('Descuento creado correctamente.')
                } else {
                    dispatch({
                        type: 'DISCOUNTS',
                        payload: {
                            ...state.discounts,
                            data: [
                                data,
                                ...state.discounts.data.filter(d => d.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Descuento editado correctamente.')
                }
                setSeverity('success')
                reset(setOpen)
            } else {
                setMessage(data.message)
                setSeverity('error')
                setDisabled(false)
            }
            setOpenMessage(true)
        }
    }

    async function handleDelete(formData) {
        setLoadingDiscounts(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'DISCOUNTS',
                payload: {
                    ...state.discounts,
                    data: [...state.discounts.data.filter(d => d.id !== data.id)]
                }
            })
            setMessage('Descuento eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage('Ocurrió un error. Actualice la página.')
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingDiscounts(false)
        setOpen(null)
    }

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: '#',
            accessor: 'id'
        },
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Nombre",
            sorter: (row) => row.name,
            accessor: (row) => row.name
        },
        {
            id: "type",
            numeric: false,
            disablePadding: true,
            label: "Tipo",
            sorter: (row) => row.type,
            accessor: (row) => row.type
        },
        {
            id: "from",
            numeric: false,
            disablePadding: true,
            label: "Desde",
            sorter: (row) => row.from,
            accessor: (row) => row.from
        },
        {
            id: "to",
            numeric: false,
            disablePadding: true,
            label: "Hasta",
            sorter: (row) => row.to,
            accessor: (row) => row.to
        },
        {
            id: "value",
            numeric: false,
            disablePadding: true,
            label: "Valor",
            sorter: (row) => row.value,
            accessor: (row) => row.value
        },
        {
            id: "base",
            numeric: false,
            disablePadding: true,
            label: "Base",
            sorter: (row) => row.base,
            accessor: (row) => row.base
        },
        {
            id: "supplier",
            numeric: false,
            disablePadding: true,
            label: "Proveedor",
            sorter: (row) => row.supplier_id,
            accessor: (row) => row.supplier_id
        },
        {
            id: 'is_available',
            numeric: false,
            disablePadding: true,
            label: 'Habilitado',
            sorter: (row) => row.is_available ? 1 : 0,
            accessor: (row) => (
                <Box sx={{ textAlign: 'center' }}>
                    <FormControlLabel
                        control={<Checkbox />}
                        checked={row.is_available}
                    />
                </Box>
            )
        }
    ], [])

    return {
        loadingDiscounts,
        setLoadingDiscounts,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getDiscounts,
        headCells
    }
}