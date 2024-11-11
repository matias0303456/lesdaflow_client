/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Checkbox, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
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
                        {rows.length > 0 &&
                            Array.from({ length: Math.max(...rows.map(r => r.payment_dates.length)) })
                                .map((col, idx) => <TableCell key={col}>{`Cuota ${idx + 1}`}</TableCell>)
                        }
                        <TableCell align="center">Obs.</TableCell>
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
                                {row.payment_dates.map((pd, pdIdx) => {
                                    const paymentExists = row.payments.find((_, pIdx) => pdIdx === pIdx)
                                    const isNextPendingPayment = pdIdx === row.payments.length
                                    return (
                                        <TableCell key={pd} align="center">
                                            {paymentExists ? (
                                                <Chip
                                                    label="Pagado"
                                                    onClick={() => {
                                                        setWorkOn({ loan: row, payment: pd });
                                                        setFormData(paymentExists);
                                                        setOpen('PAYMENT-DETAILS');
                                                    }}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Checkbox
                                                        checked={false}
                                                        disabled={!isNextPendingPayment}
                                                        onClick={() => {
                                                            setWorkOn({ loan: row, payment: pd });
                                                            setFormData({
                                                                ...formData,
                                                                date: new Date(pd + 'T00:00:00'),
                                                                loan_id: row.id
                                                            });
                                                            setOpen('NEW-PAYMENT');
                                                        }}
                                                    />
                                                    <Typography variant="small">
                                                        {format(new Date(pd + 'T00:00:00'), 'dd/MM/yy')}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TableCell>
                                    )
                                })}
                                {Array.from({
                                    length: Math.max(...rows.map(r => r.payment_dates.length)) - row.payment_dates.length
                                }).map((_, idx) => <TableCell key={idx} />)}
                                <TableCell align="center">{row.observations}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
