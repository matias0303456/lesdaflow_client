import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { useForm } from "../hooks/useForm";
import { useUsers } from "../hooks/useUsers";
import { useCommissions } from "../hooks/useCommissions";
import { useSettlements } from "../hooks/useSettlements";

import { Layout } from "../components/common/Layout";
import { FirstSection } from "../components/commissions/FirstSection";
import { SecondSection } from "../components/commissions/SecondSection";
import { ThirdSection } from "../components/commissions/ThirdSection";

export function Comissions() {

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    const {
        getCommissions,
        commissions,
        open,
        setOpen,
        newCommissionValue,
        setNewCommissionValue,
        handleSubmit,
        setCommissions,
        handleCloseCommissions,
        newCommissionDate,
        setNewCommissionDate,
        newCommissionType,
        setNewCommissionType,
        calculations,
        setCalculations,
        handleCalculateCommissions
    } = useCommissions()
    const {
        open: openSettlement,
        setOpen: setOpenSettlement,
        newSettlement,
        setNewSettlement,
        createSettlement,
        handleCloseSettlement
    } = useSettlements()
    const { getUsers } = useUsers()
    const { formData, handleChange } = useForm({
        defaultData: {
            from: new Date(Date.now()),
            to: new Date(Date.now()),
            user: auth?.user.role !== 'ADMINISTRADOR' ? auth?.user.name : ''
        }
    });

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        } else if (auth?.user.role === 'ADMINISTRADOR') {
            getUsers()
        }
    }, [])

    useEffect(() => {
        (async () => {
            const user_id = auth?.user.role === 'ADMINISTRADOR' ? formData.user : auth?.user.id
            if (formData.user.toString().length > 0) {
                await getCommissions(user_id)
            } else {
                setCommissions([])
                setCalculations({
                    seller: '',
                    'CUENTA_CORRIENTE': {
                        sales: [],
                        total: 0,
                        commission: 0
                    },
                    'CONTADO': {
                        sales: [],
                        total: 0,
                        commission: 0
                    },
                    'POXIPOL': {
                        sales: [],
                        total: 0,
                        commission: 0
                    }
                })
            }
        })()
    }, [formData])

    useEffect(() => {
        (async () => {
            const { user, from, to } = formData
            if (user.toString().length > 0) {
                const user_id = auth?.user.role === 'ADMINISTRADOR' ? user : auth?.user.id
                await handleCalculateCommissions({ from, to, user_id })
            }
        })()
    }, [formData, commissions])

    return (
        <Layout title="Comisiones">
            <FirstSection
                formData={formData}
                handleChange={handleChange}
                newSettlement={newSettlement}
                setNewSettlement={setNewSettlement}
                calculations={calculations}
                openSettlement={openSettlement}
                setOpenSettlement={setOpenSettlement}
                handleCloseSettlement={handleCloseSettlement}
                createSettlement={createSettlement}
            />
            <SecondSection
                formData={formData}
                open={open}
                setOpen={setOpen}
                commissions={commissions}
                handleCloseCommissions={handleCloseCommissions}
                newCommissionValue={newCommissionValue}
                setNewCommissionValue={setNewCommissionValue}
                newCommissionType={newCommissionType}
                setNewCommissionType={setNewCommissionType}
                newCommissionDate={newCommissionDate}
                setNewCommissionDate={setNewCommissionDate}
                handleSubmit={handleSubmit}
            />
            <ThirdSection calculations={calculations} />
        </Layout>
    )
}