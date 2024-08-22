import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

import { usePayments } from "../hooks/usePayments";
import { getCommissionValueByPayment } from "../utils/helpers";
import { useUsers } from "../hooks/useUsers";
import { ModalComponent } from "../components/common/ModalComponent";
import { PaymentFilter } from "../components/filters/PaymentFilter";

export function Comissions() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const navigate = useNavigate()

    const { formData, setFormData, disabled } = useForm({ defaultData: {}, rules: {} })

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        }
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: false,
            disablePadding: true,
            label: 'N° bol.',
            accessor: 'id'
        },
    ]

    return (
        <Layout title="Comisiones">
           
        </Layout>
    )
}