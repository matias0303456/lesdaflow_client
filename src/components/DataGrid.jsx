import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from "@mui/icons-material/Settings";
import { visuallyHidden } from '@mui/utils';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

import { deadlineIsPast, getStock } from '../utils/helpers';
import { Delete } from '@mui/icons-material';

function descendingComparator(a, b, orderBy, sorter) {
    if ((b[orderBy] ? b[orderBy] : sorter(b)) < (a[orderBy] ? a[orderBy] : sorter(a))) {
        return -1;
    }
    if ((b[orderBy] ? b[orderBy] : sorter(b)) > (a[orderBy] ? a[orderBy] : sorter(a))) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy, sorter) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, sorter)
        : (a, b) => -descendingComparator(a, b, orderBy, sorter);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead({
    headCells,
    order,
    orderBy,
    onRequestSort,
    disableSorting
}) {

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {disableSorting ? headCell.label :
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export function DataGrid({
    children,
    headCells,
    rows,
    setOpen,
    setData,
    deadlineColor = false,
    disableSorting = false,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    contentHeader
}) {

    const [order, setOrder] = React.useState(defaultOrder);
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        if (disableSorting) return
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

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );

    return (
        <div className='gridContainer'>
            <Box sx={{ width: '100%', backgroundColor: '#fff', padding: 1 }}>
                <Box sx={{ marginBottom: 3 }}>
                    {contentHeader}
                </Box>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                headCells={headCells}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                disableSorting={disableSorting}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    return (
                                      <TableRow
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                      >
                                        <TableCell sx={{ wordWrap: "" }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              opacity: 0.3,
                                            }}
                                          >
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
                                              <IconButton>
                                                <SearchSharpIcon />
                                              </IconButton>
                                            </Tooltip>
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
                                              <IconButton>
                                                <EditIcon />
                                              </IconButton>
                                            </Tooltip>
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
                                              <IconButton aria-label="delete">
                                                <Delete />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip
                                              title="Configuracion"
                                              onClick={() => {
                                                setData(
                                                  rows.find(
                                                    (r) => r.id === row.id
                                                  )
                                                );
                                                setOpen("SETTING");
                                              }}
                                            >
                                              <IconButton aria-label="setting">
                                                <SettingsIcon />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        </TableCell>
                                        {headCells
                                          .map((cell) => cell.accessor)
                                          .map((accessor) => (
                                            <TableCell
                                              key={accessor}
                                              align="center"
                                              sx={{
                                                color:
                                                  (deadlineColor === "sales" &&
                                                    deadlineIsPast(row)) ||
                                                  (deadlineColor ===
                                                    "clients" &&
                                                    row.sales.some((s) =>
                                                      deadlineIsPast(s)
                                                    )) ||
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
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
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
               {/*  <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Condensar tabla"
                /> */}
            </Box>
        </div>
    );
}