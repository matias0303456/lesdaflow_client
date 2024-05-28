/* eslint-disable react/prop-types */
import { useState, useMemo, useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from "@mui/icons-material/Settings"
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp'
import { SiMicrosoftexcel } from "react-icons/si"
import CloseIcon from "@mui/icons-material/Close"
import { LinearProgress } from '@mui/material'

import { DataContext } from '../providers/DataProvider'

import { EnhancedTableHead } from './EnhancedTableHead'

import { deadlineIsPast, getStock } from '../utils/helpers'
import { getComparator, stableSort } from '../utils/dataGrid'

export function DataGridWithBackendPagination({
  children,
  headCells,
  rows,
  setOpen,
  setFormData,
  entityKey,
  getter,
  contentHeader,
  loading,
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
  openExcelUrl = ''
}) {

  const { state, dispatch } = useContext(DataContext)

  const [order, setOrder] = useState(defaultOrder)
  const [orderBy, setOrderBy] = useState(defaultOrderBy)

  const handleRequestSort = (event, property) => {
    if (disableSorting) return
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    dispatch({
      type: entityKey.toUpperCase(),
      payload: { ...state[entityKey.toLowerCase()], page: newPage }
    })
  }

  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: entityKey.toUpperCase(),
      payload: { ...state[entityKey.toLowerCase()], page: 0, offset: parseInt(event.target.value, 10) }
    })
  }

  const visibleRows = useMemo(
    () => stableSort(rows, getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)),
    [order, orderBy, state[entityKey].page, state[entityKey].offset, rows, headCells]
  )

  useEffect(() => {
    getter(`?page=${state[entityKey].page}&offset=${state[entityKey].offset}`)
  }, [state[entityKey].page, state[entityKey].offset])

  return (
    <>
      {loading ?
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box> :
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
                                        if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                        if (setOpen) setOpen("VIEW")
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
                                        if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                        if (setOpen) setOpen("EDIT")
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
                                        if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                        if (setOpen) setOpen("DELETE")
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
                                      title={showSettingsAction}
                                      onClick={() => {
                                        if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                        if (setOpen) setOpen("SETTINGS")
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
                          )
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
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={-1}
                rowsPerPage={state[entityKey].offset}
                labelRowsPerPage="Registros por página"
                labelDisplayedRows={({ from, to }) => `${from}–${to} de ${state[entityKey].count}`}
                page={state[entityKey].page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                slotProps={{
                  actions: {
                    nextButton: {
                      disabled: ((state[entityKey].page + 1) * state[entityKey].offset) >= state[entityKey].count
                    }
                  }
                }}
              />
            </Paper>
            {children}
          </Box>
        </div>
      }
    </>
  )
}