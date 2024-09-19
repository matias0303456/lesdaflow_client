/* eslint-disable react/prop-types */
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { format } from "date-fns"

import { MONTHS } from "../../utils/constants"

export function PaymentHeadCells({ rows }) {

    const datesSet = Array.from(new Set(rows.flatMap(r => r.payment_dates)))
    const monthsSet = Array.from(new Set(datesSet.map(ds => new Date(ds).getMonth())))

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell align="center">Cliente</TableCell>
                        <TableCell align="center">Fecha</TableCell>
                        {monthsSet.map(m => <TableCell key={m} align="center">{MONTHS[m]}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{`${row.client.first_name} ${row.client.last_name}`}</TableCell>
                            <TableCell align="center">{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                            {monthsSet.map(m => (
                                <TableCell key={m} align="center">
                                    <Button variant="contained" size="sm">asdasd</Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}