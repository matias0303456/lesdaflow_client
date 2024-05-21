/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from "@mui/icons-material/Settings";
import { visuallyHidden } from '@mui/utils';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';
import { SiMicrosoftexcel } from "react-icons/si";
import CloseIcon from "@mui/icons-material/Close";

import { deadlineIsPast, getStock } from '../utils/helpers';

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
            className='font-bold flex-1 px-4 py-1'
            align="inherit"
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
  contentHeader,
  deadlineColor = false,
  disableSorting = false,
  defaultOrder = 'desc',
  defaultOrderBy = 'id',
  showEditAction = false,
  showViewAction = false,
  showSettingsAction = false,
  showDeleteAction = false,
  showPDFAction = false,
  showExcelAction = false,
  openPdfUrl = '',
  openExcelUrl = '',
  getter = undefined
}) {

  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  useEffect(() => {
    if (page > 0 && getter) getter(`?page=${page}&offset=${rowsPerPage}`)
  }, [page, rowsPerPage])

  useEffect(() => {
    console.log(rows)
  }, [rows])

  return (
    <div className='gridContainer'>
      <Box sx={{ width: '100%', backgroundColor: '#fff', padding: 1 }}>
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
                disableSorting={disableSorting}
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
                          <TableCell
                            sx={{ wordWrap: "", width: "auto" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "1px",
                                gap: "1rem",
                                width: "auto",
                              }}
                            >
                              {showExcelAction &&
                                <Tooltip
                                  title="Imprimir Excel"
                                  onClick={() => window.open(openExcelUrl, '_blank')}
                                >
                                  <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
                                    <SiMicrosoftexcel className="w-4 h-4" />
                                  </IconButton>
                                </Tooltip>
                              }
                              {showPDFAction &&
                                <Tooltip
                                  title="Imprimir PDF"
                                  onClick={() => window.open(openPdfUrl, '_blank')}
                                >
                                  <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
                                    <PictureAsPdfSharpIcon className="w-4 h-4" />
                                  </IconButton>
                                </Tooltip>
                              }
                              {showViewAction &&
                                <Tooltip
                                  title="Visualizar"
                                  onClick={() => {
                                    if (setData) setData(rows.find((r) => r.id === row.id));
                                    if (setOpen) setOpen("VIEW");
                                  }}
                                >
                                  <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
                                    <SearchSharpIcon className="w-4 h-4" />
                                  </IconButton>
                                </Tooltip>
                              }
                              {showEditAction &&
                                <Tooltip
                                  title="Editar"
                                  onClick={() => {
                                    if (setData) setData(rows.find((r) => r.id === row.id));
                                    if (setOpen) setOpen("EDIT");
                                  }}
                                >
                                  <IconButton className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white">
                                    <EditIcon className="w-4 h-4" />
                                  </IconButton>
                                </Tooltip>
                              }
                              {showDeleteAction &&
                                <Tooltip
                                  title="Borrar"
                                  onClick={() => {
                                    if (setData) setData(rows.find((r) => r.id === row.id));
                                    if (setOpen) setOpen("DELETE");
                                  }}
                                >
                                  <IconButton
                                    className="rounded-full bg-black/20 opacity-50 hover:bg-[#288bcd] hover:text-white"
                                    aria-label="delete"
                                  >
                                    <CloseIcon className="w-4 h-4" />
                                  </IconButton>
                                </Tooltip>
                              }
                              {showSettingsAction &&
                                <Tooltip
                                  title="Configuracion"
                                  onClick={() => {
                                    if (setData) setData(rows.find((r) => r.id === row.id));
                                    if (setOpen) setOpen("SETTINGS");
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
    </div>
  );
}