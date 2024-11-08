/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { usePayments } from "../../hooks/usePayments";
import { useForm } from "../../hooks/useForm";

import { Accordion, AccordionDetails, AccordionSummary } from "../common/AccordionComponent";
import { PaymentHeadCells } from "./PaymentHeadCells";
import { PaymentForm } from "./PaymentForm";
import { TotalsByMonth } from "./TotalsByMonth";
import { ModalComponent } from "../common/ModalComponent";

import { filterRowsByMonthAndYear, getLoansMonths, getLoansYears, getPaymentDates } from "../../utils/helpers";
import { MONTHS } from "../../utils/constants";

export function ShowLoansDetails({
    loans,
    setLoans,
    setFormDataLoan,
    setOpenLoan,
    includeSpendings,
    spendings
}) {

    const { open, setOpen, handleSubmit, handleDelete } = usePayments()
    const { formData, setFormData, setDisabled, disabled, reset, errors, handleChange, validate } = useForm({
        defaultData: {
            id: '',
            loan_id: '',
            amount: 0,
            total: 0,
            prev_pending: 0,
            pending: 0,
            date: new Date(Date.now()),
            type: 'EFECTIVO',
            observations: ''
        },
        rules: {
            amount: {
                required: true
            },
            type: {
                required: true
            },
            observations: {
                maxLength: 191
            }
        }
    })

    const [expanded, setExpanded] = useState(0)
    const [workOn, setWorkOn] = useState(null)

    const handleChangeExpanded = (panel) => (_, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    const loansWithPaymentDates = loans.map(l => ({ ...l, payment_dates: getPaymentDates(l) }))
    const loansYears = getLoansYears(loansWithPaymentDates)

    return (
        <>
            {loans.length > 0 ?
                <>
                    {loansYears.map((year, idx) => {
                        const loansMonths = getLoansMonths(loansWithPaymentDates.filter(l => new Date(l.date).getFullYear() === year))
                        return (
                            <Accordion key={year} expanded={expanded === idx} onChange={handleChangeExpanded(idx)}>
                                <AccordionSummary aria-controls={`${idx}d-content`} id={`${idx}d-header`}>
                                    <Typography>{year}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {loansMonths.map((month, idxM) => {
                                        const rows = filterRowsByMonthAndYear(loansWithPaymentDates, year, month)
                                        return (
                                            <Box key={month}>
                                                <Typography variant="h6" mt={idxM > 0 ? 2.5 : 0}>
                                                    {MONTHS[month]}
                                                </Typography>
                                                <PaymentHeadCells
                                                    rows={rows}
                                                    setOpen={setOpen}
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    setWorkOn={setWorkOn}
                                                    setFormDataLoan={setFormDataLoan}
                                                    setOpenLoan={setOpenLoan}
                                                />
                                                <TotalsByMonth
                                                    loans={rows}
                                                    includeSpendings={includeSpendings}
                                                    spendings={spendings.filter(s => new Date(s.date).getMonth() === month)}
                                                />
                                            </Box>
                                        )
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </> :
                <Typography variant="body1" align="center" mt={3}>
                    No hay datos para mostrar. Pruebe actualizar la página.
                </Typography>
            }
            <ModalComponent
                open={open === 'NEW-PAYMENT' || open === 'PAYMENT-DETAILS'}
                p={2}
                onClose={() => reset(setOpen)}
            >
                <PaymentForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    validate={validate}
                    formData={formData}
                    setFormData={setFormData}
                    reset={reset}
                    setOpen={setOpen}
                    disabled={disabled}
                    setDisabled={setDisabled}
                    errors={errors}
                    workOn={workOn}
                    loans={loans}
                    setLoans={setLoans}
                    open={open}
                    handleDelete={handleDelete}
                />
            </ModalComponent>
        </>
    )
}