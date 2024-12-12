import { useContext, useMemo, useState } from "react"
import { format } from "date-fns";

import { useQuery } from "./useQuery"
import { MessageContext } from "../providers/MessageProvider"

import { SPENDING_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useSpendings() {

    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { handleQuery } = useQuery()

    const [spendings, setSpendings] = useState([])
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState(0)
    const [open, setOpen] = useState(null)
    const [loadingSpendings, setLoadingSpendings] = useState(true)
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25
    })

    async function getSpendings(params) {
        const { status, data } = await handleQuery({
            url: `${SPENDING_URL}${params ? params : ''}`
        })
        if (status === STATUS_CODES.OK) {
            setSpendings(data[0])
            setCount(data[1])
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
        setLoadingSpendings(false)
    }

    async function getTotal() {
        const { status, data } = await handleQuery({
            url: `${SPENDING_URL}/total`
        })
        if (status === STATUS_CODES.OK) {
            setTotal(data.total)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function handleSubmit(e, validate, formData, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const urls = { 'NEW': SPENDING_URL, 'EDIT': `${SPENDING_URL}/${formData.id}` }
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' }
            const { status, data } = await handleQuery({
                url: urls[open],
                method: methods[open],
                body: formData
            })
            if (status === STATUS_CODES.OK || status === STATUS_CODES.CREATED) {
                if (open === 'NEW') {
                    const { page, offset } = filter
                    getSpendings(`?page=${page}&offset=${offset}`)
                    setMessage('Gasto creado correctamente.')
                } else {
                    setSpendings([data, ...spendings.filter(s => s.id !== data.id)])
                    setMessage('Gasto editado correctamente.')
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

    async function handleDelete(formData, reset) {
        setLoadingSpendings(true)
        const { status, data } = await handleQuery({
            url: `${SPENDING_URL}/${formData.id}`,
            method: 'DELETE'
        })
        if (status === STATUS_CODES.OK) {
            setSpendings(spendings.filter(s => s.id !== data.id))
            setCount(prev => prev - 1)
            setMessage('Gasto eliminado correctamente.')
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
        setLoadingSpendings(false)
        reset(setOpen)
    }

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            sorter: (row) => row.id,
            accessor: 'id'
        },
        {
            id: "available_interest",
            numeric: false,
            disablePadding: true,
            label: "Int. disponible",
            sorter: 'available_interest',
            accessor: 'available_interest'
        },
        {
            id: "date",
            numeric: false,
            disablePadding: true,
            label: "Fecha",
            sorter: (row) => format(new Date(row.date), 'dd/MM/yyyy'),
            accessor: (row) => format(new Date(row.date), 'dd/MM/yyyy')
        },
        {
            id: "amount",
            numeric: false,
            disablePadding: true,
            label: "Monto",
            sorter: (row) => row.amount,
            accessor: (row) => `$${row.amount}`
        },
        {
            id: "description",
            numeric: false,
            disablePadding: true,
            label: "Descripción",
            sorter: (row) => row.description,
            accessor: (row) => row.description
        },
        {
            id: "difference",
            numeric: false,
            disablePadding: true,
            label: "Saldo",
            sorter: 'difference',
            accessor: 'difference'
        }
    ], [])

    return {
        loadingSpendings,
        setLoadingSpendings,
        handleSubmit,
        handleDelete,
        open,
        setOpen,
        getSpendings,
        spendings,
        count,
        filter,
        setFilter,
        total,
        getTotal,
        headCells
    }
}