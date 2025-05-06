import { useContext, useMemo, useState } from "react"
import { Button } from "@mui/material"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"
import { useForm } from "./useForm"

import { VOUCHER_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useVouchers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get, post } = useApi(VOUCHER_URL)
    const voucherFormData = useForm({
        defaultData: {
            id: '',
            sale_id: '',
            voucher_type: '',
            number: '',
            sales_point: '',
            cae: '',
            document_type: '',
            document_number: '',
            total: 0.00
        },
        rules: {
            voucher_type: { required: true },
            sales_point: { required: true },
            document_type: { required: true },
            document_number: { required: true }
        }
    })

    const [arcaData, setArcaData] = useState({
        voucher_types: [],
        sales_points: [],
        document_types: []
    })

    async function getArcaData() {
        const { status, data } = await get(`/arca-data`)
        if (status === STATUS_CODES.OK) {
            setArcaData(data)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function getVoucherInfo({ number, sales_point, type }) {
        const { status, data } = await get(`/voucher-info/${number}/${sales_point}/${type}`)
        if (status === 200) {
            setMessage(JSON.stringify(data))
            setSeverity('success')
        } else {
            setMessage(data.message)
            setSeverity('error')
        }
        setOpenMessage(true)
    }

    async function createVoucher(e, validate, voucher, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await post(voucher)
            if (status === STATUS_CODES.OK) {
                const currentSale = state.sales.find(s => s.id === voucher.sale_id)
                dispatch({
                    type: 'SALES',
                    payload: [
                        {
                            ...currentSale,
                            vouchers: [...currentSale.vouchers, data]
                        },
                        ...state.sales.filter(s => s.id !== currentSale.id)
                    ]
                })
                setMessage('Comprobante creado correctamente.')
                setSeverity('success')
                reset()
            } else {
                console.log(data)
                setMessage('Ocurrió un error al crear el comprobante.')
                setSeverity('error')
            }
            setDisabled(false)
            setOpenMessage(true)
        }
    }

    const headCells = useMemo(() => [
        {
            id: "id",
            numeric: true,
            disablePadding: false,
            label: "#",
            accessor: 'id'
        },
        {
            id: "number",
            numeric: false,
            disablePadding: false,
            label: "N°",
            sorter: 'number',
            accessor: 'number'
        },
        {
            id: "cae",
            numeric: false,
            disablePadding: false,
            label: "CAE",
            sorter: 'cae',
            accessor: (row) => (
                <Button type="button" onClick={() => {
                    const { number, sales_point, type } = row
                    getVoucherInfo({ number, sales_point, type })
                }}>
                    {row.cae}
                </Button>
            )
        },
        {
            id: "type",
            numeric: false,
            disablePadding: false,
            label: "Tipo",
            sorter: 'type',
            accessor: 'type'
        },
        {
            id: "sales_point",
            numeric: false,
            disablePadding: false,
            label: "P. de venta",
            sorter: 'sales_point',
            accessor: 'sales_point'
        },
    ], [state.sales])

    return {
        getArcaData,
        arcaData,
        voucherFormData,
        createVoucher,
        headCells
    }
}