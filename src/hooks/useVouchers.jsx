import { useContext, useState } from "react"

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
            document_number: ''
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

    // async function getVoucherInfo(sale) {
    //     const { status, data } = await get(`/factura/${sale.id}`)
    //     if (status === 200) {

    //     } else {
    //         setMessage(data.message)
    //         setSeverity('error')
    //         setOpenMessage(true)
    //     }
    // }

    async function createVoucher(e, validate, voucher, reset, setDisabled) {
        e.preventDefault()
        if (validate()) {
            const { status, data } = await post(voucher)
            if (status === STATUS_CODES.OK) {
                const currentSale = state.sales.data.find(s => s.id === voucher.sale_id)
                dispatch({
                    type: 'SALES',
                    payload: {
                        ...state.sales,
                        data: [
                            {
                                ...currentSale,
                                vouchers: [...currentSale.vouchers, data]
                            },
                            ...state.sales.data.filter(s => s.id !== currentSale.id)
                        ]
                    }
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

    return {
        // getVoucherInfo
        getArcaData,
        arcaData,
        voucherFormData,
        createVoucher
    }
}