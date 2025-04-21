import { useContext, useState } from "react"

import { DataContext } from "../providers/DataProvider"
import { MessageContext } from "../providers/MessageProvider"
import { useApi } from "./useApi"

import { VOUCHER_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/constants"

export function useVouchers() {

    const { state, dispatch } = useContext(DataContext)
    const { setMessage, setOpenMessage, setSeverity } = useContext(MessageContext)

    const { get } = useApi(VOUCHER_URL)

    const [arcaData, setArcaData] = useState(null)

    async function getArcaData() {
        const { status, data } = await get(`/arca-data`)
        if (status === STATUS_CODES.OK) {
            console.log(data)
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

    return {
        // getVoucherInfo
        getArcaData,
        arcaData
    }
}