/* eslint-disable react/prop-types */
import { Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { format } from "date-fns"
import DeleteIcon from '@mui/icons-material/Delete';

import { MONTHS, PAYMENT_FREQUENCIES } from "../../utils/constants"
import { getLoanTotal, getPaymentAmount } from "../../utils/helpers"

export function PaymentHeadCells({
    rows,
    setOpen,
    formData,
    setFormData,
    setWorkOn,
    setFormDataLoan,
    setOpenLoan,
    frequency
}) {

    const datesSet = Array.from(new Set(rows.flatMap(r => r.payment_dates)))
    const columns = {
        [PAYMENT_FREQUENCIES[0]]: Array.from(new Set(datesSet.map(ds => new Date(ds).getMonth()))),
        [PAYMENT_FREQUENCIES[1]]: Array.from(new Set(datesSet.map(ds => format(new Date(ds), 'dd/MM/yyyy')))),
        [PAYMENT_FREQUENCIES[2]]: Array.from(new Set(datesSet.map(ds => format(new Date(ds), 'dd/MM/yyyy'))))
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">#</TableCell>
                        <TableCell align="center">Cliente</TableCell>
                        <TableCell align="center">Fecha</TableCell>
                        <TableCell align="center">Monto ($)</TableCell>
                        <TableCell align="center">Int. (%)</TableCell>
                        <TableCell align="center">Total ($)</TableCell>
                        <TableCell align="center">Pago ($)</TableCell>
                        <TableCell align="center">Mora (%)</TableCell>
                        <TableCell align="center">Obs.</TableCell>
                        {columns[frequency].map(i => (
                            <TableCell key={i} align="center">
                                {frequency === PAYMENT_FREQUENCIES[0] ? MONTHS[i].slice(0, 3) : i}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell align="center" onClick={() => {
                                setFormDataLoan(row)
                                setOpenLoan('DELETE')
                            }}>
                                <Tooltip title="Borrar">
                                    <DeleteIcon sx={{ cursor: 'pointer' }} />
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{`${row.client.first_name} ${row.client.last_name}`}</TableCell>
                            <TableCell align="center">{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell align="center">{row.amount}</TableCell>
                            <TableCell align="center">{row.interest}</TableCell>
                            <TableCell align="center">{getLoanTotal(row)}</TableCell>
                            <TableCell align="center">{getPaymentAmount(row)}</TableCell>
                            <TableCell align="center">{row.late_fee}</TableCell>
                            <TableCell align="center">{row.observations}</TableCell>
                            {columns[frequency].map(i => {
                                const paymentCorresponds = row.payment_dates.find(pd => {
                                    if (frequency === PAYMENT_FREQUENCIES[0]) return new Date(pd).getMonth() === i
                                    return new Date(pd) === i
                                })
                                const paymentExists = row.payments.find(p => {
                                    if (frequency === PAYMENT_FREQUENCIES[0]) return new Date(p.date).getMonth() === i
                                    return new Date(p.date) === i
                                })
                                return (
                                    <TableCell key={i} align="center">
                                        {paymentCorresponds &&
                                            <>
                                                {paymentExists ?
                                                    <Chip
                                                        label="Pagado"
                                                        onClick={() => {
                                                            setWorkOn({ loan: row, payment: paymentCorresponds })
                                                            setFormData(paymentExists)
                                                            setOpen('PAYMENT-DETAILS')
                                                        }}
                                                    /> :
                                                    <Checkbox
                                                        checked={false}
                                                        onClick={() => {
                                                            setWorkOn({ loan: row, payment: paymentCorresponds })
                                                            setFormData({
                                                                ...formData,
                                                                date: new Date(paymentCorresponds),
                                                                loan_id: row.id
                                                            })
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