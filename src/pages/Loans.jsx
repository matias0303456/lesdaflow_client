import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { AuthContext } from "../providers/AuthProvider";
import { useClients } from '../hooks/useClients'
import { useForm } from "../hooks/useForm";
import { useLoans } from "../hooks/useLoans";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";

export function Loans() {

    const { auth } = useContext(AuthContext)

    const {
        loadingLoans,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getLoans,
        loans,
        count,
    } = useLoans()
    const { loadingClients, getClients } = useClients()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = useForm({
        defaultData: {
            id: '',
            client_id: '',
            amount: '',
            interest: '',
            date: new Date(Date.now()),
            late_fee: '',
            payments_amount: '',
            payments_frequency: '',
            observations: ''
        },
        rules: {
            client_id: {
                required: true
            },
            date: {
                required: true
            },
            observations: {
                maxLength: 255
            }
        }
    })

    useEffect(() => {
        getClients()
        getLoans()
    }, [])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Cód.',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'seller',
            numeric: false,
            disablePadding: true,
            label: 'Vdor.',
            sorter: (row) => row.client.user.name,
            accessor: (row) => row.client.user.name
        },
        {
            id: 'client_name',
            numeric: false,
            disablePadding: true,
            label: 'Cliente',
            sorter: (row) => `${row.client.first_name} ${row.client.last_name}`,
            accessor: (row) => `${row.client.first_name} ${row.client.last_name}`
        },
        {
            id: 'work_place',
            numeric: false,
            disablePadding: true,
            label: 'Comercio',
            sorter: (row) => row.client.work_place ?? '',
            accessor: (row) => row.client.work_place
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Direcc.',
            sorter: (row) => row.client.address,
            accessor: (row) => (
                <Link target="_blank" to={`https://www.google.com/maps?q=${row.client.address}`}>
                    <span style={{ color: '#078BCD' }}>{row.client.address}</span>
                </Link>
            )
        }
    ]

    return (
        <Layout title="Ventas">
            <DataGridWithBackendPagination
                headCells={headCells}
                rows={loans}
                setOpen={setOpen}
                setFormData={setFormData}
                count={count}
                showEditAction
                showDeleteAction
                showPDFAction
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button variant="outlined" onClick={() => {
                            reset()
                            setOpen('NEW')
                        }}>
                            Agregar
                        </Button>
                    </Box>
                }
            >
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de préstamo
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '35%' }}
                            onClick={() => handleDelete(formData)}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </ModalComponent>
            </DataGridWithBackendPagination>
        </Layout>
    )
}