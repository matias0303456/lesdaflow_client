import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { SUPPLIER_URL } from "../utils/urls"

export function useSuppliers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post, put, destroy, putMassive } = useApi(SUPPLIER_URL)
    const supplierFormData = useForm({
        defaultData: {
            id: '',
            name: '',
            business_name: '',
            cuil: '',
            address: '',
            cell_phone: '',
            business_phone: '',
            email: '',
            articles: []
        },
        rules: {
            name: {
                required: true,
                maxLength: 255
            },
            business_name: {
                maxLength: 255
            },
            cuil: {
                maxLength: 255
            },
            address: {
                maxLength: 255
            },
            cell_phone: {
                maxLength: 255
            },
            business_phone: {
                maxLength: 255
            },
            email: {
                maxLength: 255
            }
        }
    })

    const [loadingSuppliers, setLoadingSuppliers] = useState(true)
    const [open, setOpen] = useState(null)
    const [supplierDiscounts, setSupplierDiscounts] = useState([])
    const [supplierSurcharges, setSupplierSurcharges] = useState([])

    async function getSuppliers(params) {
        const { status, data } = await get(params)
        if (status === 200) {
            dispatch({
                type: 'SUPPLIERS',
                payload: { ...state.suppliers, data: data[0], count: data[1] }
            })
            setLoadingSuppliers(false)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const submitData = {
                ...formData,
                discounts: supplierDiscounts,
                surcharges: supplierSurcharges
            }
            const { status, data } = open === 'NEW' ? await post(submitData) : await put(submitData)
            if (status === 200) {
                if (open === 'NEW') {
                    dispatch({ type: 'SUPPLIERS', payload: { ...state.suppliers, data: [data, ...state.suppliers.data] } })
                    setMessage('Proveedor creado correctamente.')
                } else {
                    dispatch({
                        type: 'SUPPLIERS',
                        payload: {
                            ...state.suppliers,
                            data: [
                                data,
                                ...state.suppliers.data.filter(s => s.id !== formData.id)
                            ]
                        }
                    })
                    setMessage('Proveedor editado correctamente.')
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
        setLoadingSuppliers(true)
        const { status, data } = await destroy(formData)
        if (status === 200) {
            dispatch({
                type: 'SUPPLIERS',
                payload: {
                    ...state.suppliers,
                    data: [...state.suppliers.data.filter(s => s.id !== data.id)]
                }
            })
            setMessage('Proveedor eliminado correctamente.')
            setSeverity('success')
        } else {
            if (status === 300) {
                setMessage('El proveedor tiene datos asociados.')
            } else {
                setMessage('Ocurrió un error. Actualice la página.')
            }
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSuppliers(false)
        setOpen(null)
    }

    async function handleSubmitMassive(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const body = {
                supplier: formData.id,
                articles: state.suppliers.data.find(s => s.id === formData.id).articles.map(a => ({ id: a.id, buy_price: a.buy_price })),
                percentage: parseFloat(formData.percentage)
            }
            const { status, data } = await putMassive(body)
            if (status === 200) {
                dispatch({
                    type: 'SUPPLIERS',
                    payload: {
                        ...state.suppliers,
                        data: [
                            data,
                            ...state.suppliers.data.filter(s => s.id !== data.id)
                        ]
                    }
                })
                setMessage('Precios actualizados correctamente.')
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

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Código',
            accessor: 'id'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: 'name'
        },
        {
            id: 'business_name',
            numeric: false,
            disablePadding: true,
            label: 'Razón Social',
            accessor: 'business_name'
        },
        {
            id: 'cuil',
            numeric: false,
            disablePadding: true,
            label: 'CUIL',
            accessor: 'cuil'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.address}`}>
                    <span style={{ color: '#050622' }}>{row.address}</span>
                </Link>
            )
        },
        {
            id: 'cell_phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: 'cell_phone'
        },
        {
            id: 'business_phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: 'business_phone'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        }
    ], [state.suppliers.data])

    return {
        loadingSuppliers,
        setLoadingSuppliers,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        handleSubmitMassive,
        getSuppliers,
        supplierFormData,
        headCells,
        supplierDiscounts,
        setSupplierDiscounts,
        supplierSurcharges,
        setSupplierSurcharges
    }
}