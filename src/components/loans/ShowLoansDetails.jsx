/* eslint-disable react/prop-types */
import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { Accordion, AccordionDetails, AccordionSummary } from "../common/AccordionComponent";

import { filterRowsByMonthAndYear, getLoansMonths, getLoansYears, getPaymentDates, getPaymentHeadCells } from "../../utils/helpers";
import { DataGridWithFrontendPagination } from "../datagrid/DataGridWithFrontendPagination";
import { MONTHS } from "../../utils/constants";

export function ShowLoansDetails({
    loans,
    headCells,
    frequency
}) {

    const [expanded, setExpanded] = useState(0)

    const handleChangeExpanded = (panel) => (_, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    const loansWithPaymentDates = loans.map(l => ({
        ...l,
        payment_dates: getPaymentDates(l.date, l.payments_amount, frequency)
    }))
    const loansYears = getLoansYears(loansWithPaymentDates)

    return (
        <Box>
            {loans.length > 0 ?
                <Box sx={{ p: 2 }}>
                    {loansYears.map((year, idx) => {
                        const loansMonths = getLoansMonths(loansWithPaymentDates.filter(l => new Date(l.date).getFullYear() === year))
                        return (
                            <Accordion key={year} expanded={expanded === idx} onChange={handleChangeExpanded(idx)}>
                                <AccordionSummary aria-controls={`${idx}d-content`} id={`${idx}d-header`}>
                                    <Typography>{year}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {loansMonths.map(month => {
                                        const rows = filterRowsByMonthAndYear(loansWithPaymentDates, year, month)
                                        const paymentsHeadCells = getPaymentHeadCells(rows)
                                        return (
                                            <Box key={month}>
                                                <Typography variant="h6">
                                                    {MONTHS[month]}
                                                </Typography>
                                                <DataGridWithFrontendPagination
                                                    headCells={[...headCells, ...paymentsHeadCells]}
                                                    rows={rows}
                                                />
                                            </Box>
                                        )
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </Box> :
                <Typography variant="body1" align="center" mt={3}>
                    No hay datos para mostrar.
                </Typography>
            }
        </Box>
    )
}