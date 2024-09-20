/* eslint-disable react/prop-types */
import { Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { format } from "date-fns"

import { MONTHS } from "../../utils/constants"
import { getLoanTotal, getPaymentAmount } from "../../utils/helpers"

export function PaymentHeadCells({ rows, setOpen, formData, setFormData, setWorkOn }) {

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
                        <TableCell align="center">Monto ($)</TableCell>
                        <TableCell align="center">Int. (%)</TableCell>
                        <TableCell align="center">Total ($)</TableCell>
                        <TableCell align="center">Pago ($)</TableCell>
                        <TableCell align="center">Mora (%)</TableCell>
                        <TableCell align="center">Obs.</TableCell>
                        {monthsSet.map(m => <TableCell key={m} align="center">{MONTHS[m].slice(0, 3)}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{`${row.client.first_name} ${row.client.last_name}`}</TableCell>
                            <TableCell align="center">{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell align="center">{row.amount}</TableCell>
                            <TableCell align="center">{row.interest}</TableCell>
                            <TableCell align="center">{getLoanTotal(row)}</TableCell>
                            <TableCell align="center">{getPaymentAmount(row)}</TableCell>
                            <TableCell align="center">{row.late_fee}</TableCell>
                            <TableCell align="center">{row.observations}</TableCell>
                            {monthsSet.map(m => {
                                const paymentCorresponds = row.payment_dates.find(pd => new Date(pd).getMonth() === m)
                                const paymentExists = row.payments.find(p => new Date(p.date).getMonth() === m)
                                return (
                                    <TableCell key={m} align="center">
                                        {paymentCorresponds &&
                                            <>
                                                {paymentExists ?
                                                    <Chip
                                                        label="Pagado"
                                                        onClick={() => console.log(paymentExists)}
                                                    /> :
                                                    <Checkbox
                                                        checked={false}
                                                        onClick={() => {
                                                            setWorkOn({ loan: row, payment: paymentCorresponds })
                                                            setFormData({ ...formData, loan_id: row.id })
                                                            setOpen('NEW-PAYMENT')
                                                        }}
                                                    />
                                                }
                                            </>
                                        }
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}