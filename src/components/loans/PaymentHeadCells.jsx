/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { format } from "date-fns"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { AuthContext } from "../../providers/AuthProvider";

import { MONTHS, PAYMENT_FREQUENCIES } from "../../utils/constants";
import { getLoanTotal, getNextPendingPaymentDate, getPaymentAmount } from "../../utils/helpers";
import { REPORT_URL } from "../../utils/urls";

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
    const { auth } = useContext(AuthContext);

    const datesSet = Array.from(new Set(rows.flatMap(r => r.payment_dates)));
    const columns = {
        [PAYMENT_FREQUENCIES[0]]: Array.from(new Set(datesSet.map(ds => new Date(ds).getMonth()))),
        [PAYMENT_FREQUENCIES[1]]: Array.from(new Set(datesSet.map(ds => format(new Date(ds), 'dd/MM/yyyy')))),
        [PAYMENT_FREQUENCIES[2]]: Array.from(new Set(datesSet.map(ds => format(new Date(ds), 'dd/MM/yyyy'))))
    };

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
                    {rows.map(row => {
                        const nextPendingPaymentDate = getNextPendingPaymentDate(row, frequency);

                        return (
                            <TableRow key={row.id}>
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
                                <TableCell align="center">{format(new Date(row.date), 'dd/MM/yyyy')}</TableCell>
                                <TableCell align="center">{row.amount}</TableCell>
                                <TableCell align="center">{row.interest}</TableCell>
                                <TableCell align="center">{getLoanTotal(row)}</TableCell>
                                <TableCell align="center">{getPaymentAmount(row)}</TableCell>
                                <TableCell align="center">{row.late_fee}</TableCell>
                                <TableCell align="center">{row.observations}</TableCell>
                                {
                                    columns[frequency].map(i => {
                                        const paymentCorresponds = row.payment_dates.find(pd => {
                                            if (frequency === PAYMENT_FREQUENCIES[0]) return new Date(pd).getMonth() === i;
                                            return format(new Date(pd), 'dd/MM/yyyy') === i;
                                        });
                                        const paymentExists = row.payments.find(p => {
                                            if (frequency === PAYMENT_FREQUENCIES[0]) return new Date(p.date).getMonth() === i;
                                            return format(new Date(p.date), 'dd/MM/yyyy') === i;
                                        });
                                        const isNextPendingPayment = paymentCorresponds && nextPendingPaymentDate && paymentCorresponds === nextPendingPaymentDate;

                                        return (
                                            <TableCell key={i} align="center">
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
                                                                disabled={!isNextPendingPayment} // Solo habilitar el checkbox del próximo pago faltante
                                                                onClick={() => {
                                                                    setWorkOn({ loan: row, payment: paymentCorresponds });
                                                                    setFormData({
                                                                        ...formData,
                                                                        date: new Date(paymentCorresponds),
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
