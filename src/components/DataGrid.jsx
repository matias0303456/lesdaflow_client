import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import { Button } from '@mui/material';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';

import { ModalComponent } from './ModalComponent';

import { deadlineIsPast } from '../utils/helpers';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    disableSelection
}) {

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {!disableSelection &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell>
                }
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar({
    numSelected,
    title,
    disableAdd,
    open,
    setOpen,
    data,
    setData,
    workOn,
    handleDelete,
    allowMassiveEdit,
    setMassiveEdit,
    updateBySupplier
}) {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {numSelected === 0 ?
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {title}
                        {!disableAdd &&
                            <Tooltip title="Nuevo">
                                <IconButton onClick={() => {
                                    setData(data)
                                    setOpen('NEW')
                                }}>
                                    <AddCircleSharpIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </Box>
                    : numSelected === 1 ? 'Un registro seleccionado.' :
                        `${numSelected} registros seleccionados.`}
            </Typography>
            {numSelected >= 1 &&
                <Tooltip title="Eliminar" onClick={() => {
                    setOpen('DELETE')
                }}>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            }
            {numSelected === 1 && updateBySupplier &&
                <Tooltip title="Editar precios" onClick={() => {
                    setData(workOn[0])
                    setOpen('MASSIVE-EDIT')
                }}>
                    <IconButton>
                        <AttachMoneySharpIcon />
                    </IconButton>
                </Tooltip>
            }
            {(numSelected === 1 || (numSelected >= 1 && allowMassiveEdit)) &&
                <Tooltip title="Editar" onClick={() => {
                    if (allowMassiveEdit && numSelected > 1) {
                        setMassiveEdit(workOn)
                        setOpen('MASSIVE-EDIT')
                    } else {
                        setData(workOn[0])
                        setOpen('EDIT')
                    }
                }}>
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            }
            <ModalComponent open={open === 'DELETE'} onClose={() => setOpen(null)}>
                <Typography variant="h6" sx={{ marginBottom: 3, textAlign: 'center' }}>
                    ¿Desea eliminar los elementos seleccionados?
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    marginTop: 1
                }}>
                    <Button variant="outlined" onClick={() => setOpen(null)} sx={{
                        width: '50%'
                    }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={() => handleDelete(workOn)} sx={{
                        width: '50%'
                    }}>
                        Eliminar
                    </Button>
                </Box>
            </ModalComponent>
        </Toolbar>
    );
}

export function DataGrid({
    children,
    title,
    headCells,
    rows,
    disableAdd = false,
    open,
    setOpen,
    data,
    setData,
    handleDelete,
    disableSelection = false,
    deadlineColor = false,
    allowMassiveEdit = false,
    setMassiveEdit,
    updateBySupplier = false
}) {

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <div className='gridContainer'>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        title={title}
                        disableAdd={disableAdd}
                        open={open}
                        setOpen={setOpen}
                        data={data}
                        setData={setData}
                        workOn={rows.filter(row => selected.includes(row.id))}
                        handleDelete={handleDelete}
                        allowMassiveEdit={allowMassiveEdit}
                        setMassiveEdit={setMassiveEdit}
                        updateBySupplier={updateBySupplier}
                    />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                headCells={headCells}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                disableSelection={disableSelection}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                if (!disableSelection) {
                                                    handleClick(event, row.id)
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: !disableSelection ? 'pointer' : 'auto' }}
                                        >
                                            {!disableSelection &&
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                            }
                                            {headCells.map(cell => cell.accessor).map(accessor => (
                                                <TableCell key={accessor} align="center" sx={{
                                                    color: (deadlineColor === 'sales' && deadlineIsPast(row) || (deadlineColor === 'clients' && row.sales.some(s => deadlineIsPast(s))))
                                                        ? 'red' : ''
                                                }}>
                                                    {typeof accessor === 'function' ? accessor(row) : row[accessor]}
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
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {children}
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Condensar tabla"
                />
            </Box>
        </div>
    );
}