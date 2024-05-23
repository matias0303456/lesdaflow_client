import { useContext, useState } from "react"

import { useApi } from "./useApi"
import { MessageContext } from "../providers/MessageProvider"

import { SUPPLIER_URL } from "../utils/urls"

export function useSuppliers() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { post, put, destroy, putMassive } = useApi(SUPPLIER_URL)

    const [loadingSuppliers, setLoadingSuppliers] = useState(true)
    const [suppliers, setSuppliers] = useState([])
    const [open, setOpen] = useState(null)

    const { get } = useApi(SUPPLIER_URL)

    async function getSuppliers() {
        const { status, data } = await get()
        if (status === 200) {
            setSuppliers(data[0])
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
            const { status, data } = open === 'NEW' ? await post(formData) : await put(formData)
            if (status === 200) {
                if (open === 'NEW') {
                    setSuppliers([data, ...suppliers])
                    setMessage('Proveedor creado correctamente.')
                } else {
                    setSuppliers([data, ...suppliers.filter(s => s.id !== formData.id)])
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
            setSuppliers([...suppliers.filter(s => s.id !== data.id)])
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
                products: suppliers.find(s => s.id === formData.id).products.map(p => ({ id: p.id, buy_price: p.buy_price })),
                percentage: parseFloat(formData.percentage)
            }
            const { status, data } = await putMassive(body)
            if (status === 200) {
                setSuppliers([data, ...suppliers.filter(s => s.id !== data.id)])
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

    return {
        suppliers,
        setSuppliers,
        loadingSuppliers,
        setLoadingSuppliers,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        handleSubmitMassive,
        getSuppliers
    }
}