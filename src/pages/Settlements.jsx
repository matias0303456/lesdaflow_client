import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";

import { Layout } from "../components/common/Layout";

import { REPORT_URL } from "../utils/urls";
import { useSettlements } from "../hooks/useSettlements";
import { DataGridWithFrontendPagination } from "../components/datagrid/DataGridWithFrontendPagination";
import { format } from "date-fns";

export function Settlements() {

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate()

    const { getSettlemens, settlements } = useSettlements()

    useEffect(() => {
        if (auth?.user.role !== 'ADMINISTRADOR' && auth?.user.role !== 'VENDEDOR') {
            navigate('/prep-ventas')
        } else {
            getSettlemens()
        }
    }, [])

    const headCells = [
        {
            id: "id",
            numeric: false,
            disablePadding: true,
            label: "#",
            sorter: (row) => row.id,
            accessor: 'id'
        },
        {
            id: "seller",
            numeric: false,
            disablePadding: true,
            label: "Vendedor",
            sorter: (row) => row.seller,
            accessor: 'seller'
        },
        {
            id: "created_at",
            numeric: false,
            disablePadding: true,
            label: "Fecha liq.",
            sorter: (row) => format(new Date(row.created_at), 'dd/MM/yyy'),
            accessor: (row) => format(new Date(row.created_at), 'dd/MM/yyy')
        },
        {
            id: "from_date",
            numeric: false,
            disablePadding: true,
            label: "Inicio",
            sorter: (row) => format(new Date(row.from_date), 'dd/MM/yyy'),
            accessor: (row) => format(new Date(row.from_date), 'dd/MM/yyy')
        },
        {
            id: "to_date",
            numeric: false,
            disablePadding: true,
            label: "Fin",
            sorter: (row) => format(new Date(row.to_date), 'dd/MM/yyy'),
            accessor: (row) => format(new Date(row.to_date), 'dd/MM/yyy')
        },
        {
            id: "commission_cta_cte",
            numeric: false,
            disablePadding: true,
            label: "Com. Cta. Cte.",
            sorter: (row) => row.commission_cta_cte,
            accessor: (row) => `$${row.commission_cta_cte}`
        },
        {
            id: "commission_contado",
            numeric: false,
            disablePadding: true,
            label: "Com. Contado",
            sorter: (row) => row.commission_contado,
            accessor: (row) => `$${row.commission_contado}`
        },
        {
            id: "commission_poxipol",
            numeric: false,
            disablePadding: true,
            label: "Com. Poxipol",
            sorter: (row) => row.commission_poxipol,
            accessor: (row) => `$${row.commission_poxipol}`
        }
    ];

    return (
        <Layout title="Liquidaciones">
            <DataGridWithFrontendPagination
                headCells={headCells}
                rows={settlements}
                showPDFAction={`${REPORT_URL}/settlement-pdf?token=${auth?.token}&id=`}
            />
        </Layout>
    );
}
