/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { format } from "date-fns"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { AuthContext } from "../../providers/AuthProvider";

import { getLoanTotal, getPaymentAmount, setLocalDate, setPfColor } from "../../utils/helpers";
import { REPORT_URL } from "../../utils/urls";

export function PaymentHeadCells({
    rows,
    setOpen,
    formData,
    setFormData,
    setWorkOn,
    setFormDataLoan,
    setOpenLoan
}) {
    const { auth } = useContext(AuthContext);

    const datesSet = Array.from(new Set(rows.flatMap(r => r.payment_dates)));
    const columns = Array.from(new Set(datesSet.map(ds => {
        const date = new Date(ds + 'T00:00:00')
        return format(date, 'dd/MM/yy')
    })))

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
                        <TableCell align="center">Cuota ($)</TableCell>
                        <TableCell align="center">Mora (%)</TableCell>
                        <TableCell align="center">Obs.</TableCell>
                        {columns.map(col => {
                            return (
                                <TableCell key={col} align="center">
                                    {col}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return (
                            <TableRow key={row.id} sx={{ backgroundColor: setPfColor(row.payments_frequency) }}>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Imprimir PDF">
                                            <PictureAsPdfIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => window.open(`${REPORT_URL}/prestamo-pdf/${row.id}?token=${auth.access_token}`, '_blank')}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <EditIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setFormDataLoan(row);
                                                    setOpenLoan('EDIT');
                                                }}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Borrar">
                                            <DeleteIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setFormDataLoan(row);
                                                    setOpenLoan('DELETE');
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{`${row.client.first_name} ${row.client.last_name}`}</TableCell>
                                <TableCell align="center">{format(setLocalDate(row), 'dd/MM/yy')}</TableCell>
                                <TableCell align="center">{row.amount}</TableCell>
                                <TableCell align="center">{row.interest}</TableCell>
                                <TableCell align="center">{getLoanTotal(row)}</TableCell>
                                <TableCell align="center">{getPaymentAmount(row)}</TableCell>
                                <TableCell align="center">{row.late_fee}</TableCell>
                                <TableCell align="center">{row.observations}</TableCell>
                                {
                                    columns.map(col => {
                                        const paymentCorresponds = row.payment_dates.find(pd => {
                                            const date = new Date(pd + 'T00:00:00')
                                            return format(date, 'dd/MM/yy') === col;
                                        });
                                        const paymentExists = row.payments.find((_, pIdx) => {
                                            const rowCols = columns.filter(c => {
                                                return row.payment_dates.map(pd => {
                                                    const pdDate = new Date(pd + 'T00:00:00')
                                                    return format(pdDate, 'dd/MM/yy')
                                                }).includes(c)
                                            })
                                            return rowCols[pIdx] === col;
                                        });
                                        const isNextPendingPayment = row.payment_dates.indexOf(paymentCorresponds) === row.payments.length
                                        return (
                                            <TableCell key={col} align="center">
                                                {paymentCorresponds && (
                                                    <>
                                                        {paymentExists ? (
                                                            <Chip
                                                                label="Pagado"
                                                                onClick={() => {
                                                                    setWorkOn({ loan: row, payment: paymentCorresponds });
                                                                    setFormData(paymentExists);
                                                                    setOpen('PAYMENT-DETAILS');
                                                                }}
                                                            />
                                                        ) : (
                                                            <Checkbox
                                                                checked={false}
                                                                disabled={!isNextPendingPayment}
                                                                onClick={() => {
                                                                    setWorkOn({ loan: row, payment: paymentCorresponds });
                                                                    setFormData({
                                                                        ...formData,
                                                                        date: new Date(paymentCorresponds + 'T00:00:00'),
                                                                        loan_id: row.id
                                                                    });
                                                                    setOpen('NEW-PAYMENT');
                                                                }}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </TableCell>
                                        );
                                    })
                                }
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
