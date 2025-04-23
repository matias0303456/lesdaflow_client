import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useArticles } from '../hooks/useArticles'
import { useSuppliers } from "../hooks/useSuppliers";
import { useForm } from "../hooks/useForm";
import { useMovements } from "../hooks/useMovements";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { ArticleFilter } from "../components/filters/ArticleFilter";
import { MovementsForm } from "../components/commercial/MovementsForm";

export function Articles() {

    const { auth } = useContext(AuthContext)
    const { state } = useContext(DataContext)

    const {
        loadingArticles,
        open,
        setOpen,
        handleSubmit,
        handleDelete,
        getArticles,
        articleFormData,
        headCells,
        actPricesRef,
        handleActPrices,
        uploadedFile,
        setUploadedFile
    } = useArticles()
    const { loadingSuppliers, getSuppliers } = useSuppliers()
    const { formData, setFormData, handleChange, disabled, setDisabled, validate, reset, errors } = articleFormData
    const {
        open: openMovement,
        setOpen: setOpenMovement,
        handleSubmit: handleSubmitMovement
    } = useMovements()
    const {
        formData: formDataMovement,
        setFormData: setFormDataMovement,
        handleChange: handleChangeMovement,
        errors: errorsMovement,
        disabled: disabledMovement,
        setDisabled: setDisabledMovement,
        reset: resetMovement,
        validate: validateMovement
    } = useForm({
        defaultData: { amount: '', observations: '' },
        rules: { amount: { required: true }, observations: { maxLength: 255 } }
    })

    useEffect(() => {
        getSuppliers()
    }, [])

    return (
        <Layout title="Artículos">
            <DataGridWithBackendPagination
                headCells={headCells}
                rows={state.articles}
                setOpen={setOpen}
                setOpenNewMovement={setOpenMovement}
                setFormData={setFormData}
                setFormDataMovement={setFormDataMovement}
                entityKey="articles"
                getter={getArticles}
                loading={loadingSuppliers || loadingArticles || disabled}
                deadlineColor="articles"
                showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
                showEditAction={auth?.user.role === 'ADMINISTRADOR'}
                showInput={auth?.user.role === 'ADMINISTRADOR' && "Ingresar stock"}
                showOutput={auth?.user.role === 'ADMINISTRADOR' && "Egresar stock"}
                showViewAction
                contentHeader={
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                            {auth?.user.role === 'ADMINISTRADOR' &&
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            reset()
                                            setOpen('NEW')
                                        }}>
                                        Agregar
                                    </Button>
                                    <input
                                        type="file"
                                        ref={actPricesRef}
                                        onChange={(e) => setUploadedFile(e.target.files[0])}
                                        accept=".xlsx, .xls"
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color='success'
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => {
                                            if (uploadedFile !== null) {
                                                handleActPrices()
                                            } else {
                                                actPricesRef.current.click()
                                            }
                                        }}
                                    >
                                        {uploadedFile !== null ? 'Subir' : 'Act. precios'}
                                    </Button>
                                    {uploadedFile !== null &&
                                        <Button
                                            variant="outlined"
                                            color='error'
                                            size="small"
                                            onClick={() => {
                                                actPricesRef.current.value = null
                                                setUploadedFile(null)
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    }
                                </>
                            }
                        </Box>
                        <ArticleFilter />
                    </Box>
                }
            >
                <ModalComponent
                    open={open === 'NEW' || open === 'EDIT' || open === 'VIEW'}
                    onClose={() => reset(setOpen)}
                    reduceWidth={500}
                >
                    <Typography variant="h6" sx={{ marginBottom: 0.5 }}>
                        {open === 'NEW' && 'Nuevo artículo'}
                        {open === 'EDIT' && 'Editar artículo'}
                        {open === 'VIEW' && `Artículo #${formData.id}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="code">Código *</InputLabel>
                                    <Input id="code" type="text" name="code" value={formData.code} disabled={open === 'VIEW'} />
                                    {errors.code?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El código es requerido.
                                        </Typography>
                                    }
                                    {errors.code?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El código es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="details">Nombre Artículo *</InputLabel>
                                    <Input id="details" type="text" name="details" value={formData.details} disabled={open === 'VIEW'} />
                                    {errors.details?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es requerido.
                                        </Typography>
                                    }
                                    {errors.details?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="price">Precio *</InputLabel>
                                    <Input id="price" type="number" name="price" value={formData.price} disabled={open === 'VIEW'} />
                                    {errors.price?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El precio es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel id="supplier-select">Proveedor *</InputLabel>
                                    <Select
                                        labelId="supplier-select"
                                        id="supplier_id"
                                        value={formData.supplier_id}
                                        label="Proveedor"
                                        name="supplier_id"
                                        onChange={handleChange}
                                        disabled={open === 'VIEW'}
                                    >
                                        {state.suppliers.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.supplier_id?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El proveedor es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            {open === 'NEW' &&
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel htmlFor="amount">Stock</InputLabel>
                                    <Input id="amount" type="number" name="amount" value={formData.amount} disabled={open === 'VIEW'} />
                                </FormControl>
                            }
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginTop: 1,
                                width: '50%'
                            }}>
                                <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{
                                    width: '50%'
                                }}>
                                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                                </Button>
                                {(open === 'NEW' || open === 'EDIT') &&
                                    <Button type="submit" variant="contained" disabled={disabled} sx={{
                                        width: '50%'
                                    }}>
                                        Confirmar
                                    </Button>
                                }
                            </FormControl>
                        </Box>
                    </form>
                </ModalComponent>
                <ModalComponent open={open === 'DELETE'} onClose={() => reset(setOpen)} reduceWidth={900}>
                    <Typography variant="h6" marginBottom={1} textAlign="center">
                        Confirmar eliminación de artículo
                    </Typography>
                    <Typography variant="body1" marginBottom={2} textAlign="center">
                        Los datos no podrán recuperarse
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '35%' }}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            disabled={disabled}
                            sx={{ width: '35%' }}
                            onClick={() => handleDelete(formData)}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </ModalComponent>
                <MovementsForm
                    open={openMovement}
                    setOpen={setOpenMovement}
                    formData={formDataMovement}
                    errors={errorsMovement}
                    handleChange={handleChangeMovement}
                    reset={resetMovement}
                    disabled={disabledMovement}
                    setDisabled={setDisabledMovement}
                    handleSubmit={handleSubmitMovement}
                    validate={validateMovement}
                />
            </DataGridWithBackendPagination>
        </Layout>
    )
}