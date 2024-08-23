import { useContext, useState } from "react";

import { MessageContext } from "../providers/MessageProvider";
import { useApi } from "./useApi";

import { SETTLEMENT_URL } from "../utils/urls";

export function useSettlements() {

    const { setMessage, setSeverity, setOpenMessage } = useContext(MessageContext)

    const { get, post } = useApi(SETTLEMENT_URL)

    const [open, setOpen] = useState(null)
    const [settlements, setSettlements] = useState([])
    const [newSettlement, setNewSettlement] = useState({
        seller: '',
        from_date: new Date(Date.now()).toISOString(),
        to_date: new Date(Date.now()).toISOString(),
        total_cta_cte: 0,
        commission_cta_cte: 0,
        last_cta_cte_value: 0,
        total_contado: 0,
        commission_contado: 0,
        last_contado_value: 0,
        total_poxipol: 0,
        commission_poxipol: 0,
        last_poxipol_value: 0,
        sales: []
    })

    async function getSettlemens() {
        const { status, data } = await get()
        if (status === 200) {
            setSettlements(data)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    async function createSettlement() {
        const { status, data } = await post(newSettlement)
        if (status === 200) {
            console.log(data)
            setOpen(null)
        } else {
            setMessage(data.message)
            setSeverity('error')
            setOpenMessage(true)
        }
    }

    function handleCloseSettlement() {
        setNewSettlement({
            seller: '',
            from_date: new Date(Date.now()).toISOString(),
            to_date: new Date(Date.now()).toISOString(),
            total_cta_cte: 0,
            commission_cta_cte: 0,
            last_cta_cte_value: 0,
            total_contado: 0,
            commission_contado: 0,
            last_contado_value: 0,
            total_poxipol: 0,
            commission_poxipol: 0,
            last_poxipol_value: 0,
            sales: []
        })
        setOpen(null)
        setSettlements([])
    }

    return {
        open,
        setOpen,
        settlements,
        setSettlements,
        getSettlemens,
        createSettlement,
        newSettlement,
        setNewSettlement,
        handleCloseSettlement
    }
}