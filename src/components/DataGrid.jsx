import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import PasswordSharpIcon from '@mui/icons-material/PasswordSharp';
import PrintSharpIcon from '@mui/icons-material/PrintSharp';
import { SearchSharp } from '@mui/icons-material';

import { AuthContext } from '../providers/AuthProvider';
import { PageContext } from '../providers/PageProvider';

import { ModalComponent } from './ModalComponent';

import { deadlineIsPast, getStock } from '../utils/helpers';
import { REPORT_URL } from '../utils/urls';

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
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    disableSelection,
    disableSorting
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
    updateByPercentage,
    changePwd,
    seeAccount,
    handlePrint,
    selected,
    rows,
    orderBy,
    order
}) {

    const { auth } = React.useContext(AuthContext)
    const { search } = React.useContext(PageContext)

    const navigate = useNavigate()
    const { pathname } = useLocation()

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
                    <Box sx={{ display: 'flex', justifyContent: title.length > 0 ? 'space-between' : 'end' }}>
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
            {numSelected >= 1 && auth.user.role.name === 'ADMINISTRADOR' &&
                <>
                    <Tooltip title="Eliminar" onClick={() => {
                        setOpen('DELETE')
                    }}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    {handlePrint && pathname === '/veroshop/cajas' && numSelected === 1 &&
                        <Tooltip title="Imprimir PDF">
                            <Link
                                to={`${REPORT_URL}/payments/${auth.token}/${selected[0]}`}
                                target="_blank"
                            >
                                <IconButton>
                                    <PrintSharpIcon />
                                </IconButton>
                            </Link>
                        </Tooltip>
                    }
                </>
            }
            {auth.user.role.name === 'ADMINISTRADOR' &&
                handlePrint &&
                pathname === '/veroshop/productos' &&
                rows.length > 0 &&
                <Tooltip title="Imprimir Excel">
                    <Link
                        to={`${REPORT_URL}/products?token=${auth.token}${selected.length > 0 ? `&ids=${selected.join(',')}` : ''}`}
                        target="_blank"
                    >
                        <IconButton>
                            <PrintSharpIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
            }
            {handlePrint &&
                pathname === '/veroshop/ventas' &&
                rows.length > 0 &&
                <Tooltip title="Imprimir PDF">
                    <Link
                        to={`${REPORT_URL}/sales?token=${auth.token}&orderBy=${orderBy}&order=${order}${selected.length > 0 ? `&ids=${selected.join(',')}` : ''}${search.length > 0 ? search : ''}`}
                        target="_blank"
                    >
                        <IconButton>
                            <PrintSharpIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
            }
            {numSelected === 1 && changePwd && workOn[0]?.role.name === 'VENDEDOR' &&
                <Tooltip title="Cambiar contraseña" onClick={() => {
                    setData(workOn[0])
                    setOpen('PWD-EDIT')
                }}>
                    <IconButton>
                        <PasswordSharpIcon />
                    </IconButton>
                </Tooltip>
            }
            {numSelected === 1 && updateByPercentage &&
                <Tooltip title="Actualizar precio/s por porcentaje" onClick={() => {
                    setData(workOn[0])
                    if (setMassiveEdit) setMassiveEdit(workOn)
                    setOpen('MASSIVE-EDIT')
                }}>
                    <IconButton>
                        <AttachMoneySharpIcon />
                    </IconButton>
                </Tooltip>
            }
            {(numSelected === 1 || (numSelected >= 1 && allowMassiveEdit)) &&
                <Tooltip title={allowMassiveEdit && numSelected > 1 ?
                    "Actualizar precio/s por porcentaje" :
                    "Editar"} onClick={() => {
                        if (allowMassiveEdit && numSelected > 1) {
                            setMassiveEdit(workOn)
                            setOpen('MASSIVE-EDIT')
                        } else {
                            setData(workOn[0])
                            setOpen('EDIT')
                        }
                    }}>
                    <IconButton>
                        {
                            allowMassiveEdit && numSelected > 1 ?
                                <AttachMoneySharpIcon /> :
                                <EditIcon />
                        }
                    </IconButton>
                </Tooltip>
            }
            {numSelected === 1 && seeAccount &&
                <Tooltip title="Ver detalle" onClick={() => {
                    navigate(`/veroshop/cuenta/${workOn[0].id}`)
                }}>
                    <IconButton>
                        <SearchSharp />
                    </IconButton>
                </Tooltip>
            }
            <ModalComponent reduceWidth={500} open={open === 'DELETE'} onClose={() => setOpen(null)}>
                <Typography variant="h6" sx={{ marginBottom: 3, textAlign: 'center' }}>
                    ¿Desea eliminar los elementos seleccionados?
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    margin: '0 auto',
                    marginTop: 1,
                    width: '50%'
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
    updateByPercentage = false,
    changePwd = false,
    seeAccount = false,
    handlePrint = false,
    disableSorting = false,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    stopPointerEvents = false,
    pageKey,
    getter = undefined
}) {

    const { page, setPage, offset, setOffset, count } = React.useContext(PageContext)

    const [order, setOrder] = React.useState(defaultOrder);
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(true);

    const handleRequestSort = (event, property) => {
        if (disableSorting) return
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
        setPage({ ...page, [pageKey]: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setOffset({ ...offset, [pageKey]: event.target.value });
        setPage({ ...page, [pageKey]: 0 });
    };

    React.useEffect(() => {
        (async () => {
            if (getter) getter()
        })()
    }, [page, offset])

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const visibleRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)),
        [order, orderBy, page, offset, rows, headCells]
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
                        updateByPercentage={updateByPercentage}
                        changePwd={changePwd}
                        seeAccount={seeAccount}
                        handlePrint={handlePrint}
                        selected={selected}
                        rows={rows}
                        orderBy={orderBy}
                        order={order}
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
                                disableSorting={disableSorting}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                if (!disableSelection && !stopPointerEvents) {
                                                    handleClick(event, row.id)
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id ?? index}
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
                                                    color: (
                                                        (deadlineColor === 'sales' && deadlineIsPast(row)) ||
                                                        (deadlineColor === 'clients' && row.sales?.some(s => deadlineIsPast(s))) ||
                                                        (deadlineColor === 'products' && row.min_stock > getStock(row))
                                                    ) ? 'red' : ''
                                                }}>
                                                    {typeof accessor === 'function' ? accessor(row, index) : row[accessor]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={-1}
                        rowsPerPage={offset[pageKey]}
                        labelRowsPerPage="Registros por página"
                        labelDisplayedRows={({ from, to }) => `${from}–${to} de ${count[pageKey]}`}
                        page={page[pageKey]}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        slotProps={{
                            actions: {
                                nextButton: {
                                    disabled: ((page[pageKey] + 1) * offset[pageKey]) >= count[pageKey]
                                }
                            }
                        }}
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