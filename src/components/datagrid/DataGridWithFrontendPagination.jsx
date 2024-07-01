/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from "@mui/icons-material/Settings";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import CloseIcon from "@mui/icons-material/Close";

import { EnhancedTableHead } from './EnhancedTableHead';

import { deadlineIsPast, getStock } from '../../utils/helpers';
import { getComparator, stableSort } from '../../utils/dataGrid';

export function DataGridWithFrontendPagination({
    children,
    headCells,
    rows,
    setOpen,
    setData,
    contentHeader,
    deadlineColor = false,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    showEditAction = false,
    showViewAction = false,
    showSettingsAction = false,
    showDeleteAction = false
}) {

    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );
    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box sx={{ marginBottom: 3 }}>
                {contentHeader}
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750, fontWeight: "bold" }}
                        aria-labelledby="tableTitle"
                        size="small"
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                visibleRows && visibleRows.length > 0 ? (
                                    visibleRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                                width="100px"
                                            >
                                                <TableCell sx={{ width: "auto" }}>
                                                    <Box sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        padding: "1px",
                                                        gap: "1rem",
                                                        width: "auto",
                                                    }}>
                                                        {showViewAction &&
                                                            <Tooltip
                                                                title="Visualizar"
                                                                onClick={() => {
                                                                    setData(
                                                                        rows.find(
                                                                            (r) => r.id === row.id
                                                                        )
                                                                    );
                                                                    setOpen("VIEW");
                                                                }}
                                                            >
                                                                <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd]">
                                                                    <SearchSharpIcon className="w-4 h-4 hover:text-white" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {showEditAction &&
                                                            <Tooltip
                                                                title="Editar"
                                                                onClick={() => {
                                                                    setData(
                                                                        rows.find(
                                                                            (r) => r.id === row.id
                                                                        )
                                                                    );
                                                                    setOpen("EDIT");
                                                                }}
                                                            >
                                                                <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd]">
                                                                    <EditIcon className="w-4 h-4 hover:text-white" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {showDeleteAction &&
                                                            <Tooltip
                                                                title="Borrar"
                                                                onClick={() => {
                                                                    setData(
                                                                        rows.find(
                                                                            (r) => r.id === row.id
                                                                        )
                                                                    );
                                                                    setOpen("DELETE");
                                                                }}
                                                            >
                                                                <IconButton
                                                                    className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd]"
                                                                    aria-label="delete"
                                                                >
                                                                    <CloseIcon className="w-4 h-4 hover:text-white" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {showSettingsAction &&
                                                            <Tooltip
                                                                title={showSettingsAction}
                                                                onClick={() => {
                                                                    setData(
                                                                        rows.find(
                                                                            (r) => r.id === row.id
                                                                        )
                                                                    );
                                                                    setOpen("SETTING");
                                                                }}
                                                            >
                                                                <IconButton
                                                                    className="rounded-full bg-black/20 opacity-50 hover:bg-[#078BCD]"
                                                                    aria-label="setting"
                                                                >
                                                                    <SettingsIcon className="w-4 h-4 hover:text-white" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                    </Box>
                                                </TableCell>
                                                {headCells
                                                    .map((cell) => cell.accessor)
                                                    .map((accessor) => (
                                                        <TableCell
                                                            key={accessor}
                                                            align="inherit"
                                                            sx={{
                                                                color:
                                                                    (deadlineColor === "sales" &&
                                                                        deadlineIsPast(row)) ||
                                                                        // (deadlineColor ===
                                                                        //     "clients" &&
                                                                        //     row.sales.some((s) =>
                                                                        //         deadlineIsPast(s)
                                                                        //     )) ||
                                                                        (deadlineColor ===
                                                                            "products" &&
                                                                            row.min_stock >
                                                                            getStock(row))
                                                                        ? "red"
                                                                        : "",
                                                            }}
                                                        >
                                                            {typeof accessor === "function"
                                                                ? accessor(row, index)
                                                                : row[accessor]}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={headCells.length + 1}
                                            align="inherit"
                                            sx={{
                                                fontSize: "1rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            No se encontraron registros
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {children}
        </Box>
    );
}