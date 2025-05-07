import { useContext, useEffect } from "react";
import { Box, Button, FormControl, LinearProgress, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useArticles } from '../hooks/useArticles'
import { useSuppliers } from "../hooks/useSuppliers";
import { useForm } from "../hooks/useForm";
import { useMovements } from "../hooks/useMovements";

import { Layout } from "../components/common/Layout";
import { ModalComponent } from "../components/common/ModalComponent";
import { DataGridWithBackendPagination } from "../components/datagrid/DataGridWithBackendPagination";
import { MovementsForm } from "../components/commercial/MovementsForm";
import { DiscountsAndSurcharges } from "../components/common/DiscountsAndSurcharges";
import { ArtContentHeader } from "../components/articles/ArtContentHeader";
import { ArticleForm } from "../components/articles/ArticleForm";

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
        uploadedActFile,
        setUploadedActFile,
        uploadedNewFile,
        setUploadedNewFile,
        filter,
        setFilter,
        count,
        articleDiscounts,
        articleSurcharges,
        setArticleDiscounts,
        setArticleSurcharges,
        handleNewArticles,
        newArticlesRef
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

    useEffect(() => {
        const { page, offset, code, details, supplier_id } = filter
        getArticles(`?page=${page}&offset=${offset}&code=${code}&details=${details}&supplier_id=${supplier_id}`)
    }, [filter])

    return (
        <Layout title="Artículos">
            {(loadingSuppliers || loadingArticles || disabled) ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <DataGridWithBackendPagination
                    headCells={headCells}
                    rows={state.articles}
                    setOpen={setOpen}
                    setFormData={setFormData}
                    showDeleteAction={auth?.user.role === 'ADMINISTRADOR'}
                    showEditAction={auth?.user.role === 'ADMINISTRADOR'}
                    showInput={auth?.user.role === 'ADMINISTRADOR' && "Ingresar stock"}
                    showOutput={auth?.user.role === 'ADMINISTRADOR' && "Egresar stock"}
                    setFormDataMovement={setFormDataMovement}
                    filter={filter}
                    setFilter={setFilter}
                    setOpenNewMovement={setOpenMovement}
                    count={count}
                    showViewAction
                    contentHeader={
                        <ArtContentHeader
                            reset={reset}
                            setOpen={setOpen}
                            actPricesRef={actPricesRef}
                            setUploadedActFile={setUploadedActFile}
                            uploadedActFile={uploadedActFile}
                            handleActPrices={handleActPrices}
                            newArticlesRef={newArticlesRef}
                            uploadedNewFile={uploadedNewFile}
                            setUploadedNewFile={setUploadedNewFile}
                            handleNewArticles={handleNewArticles}
                            filter={filter}
                            setFilter={setFilter}
                        />
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
                        <ArticleForm
                            handleChange={handleChange}
                            errors={errors}
                            formData={formData}
                            open={open}
                        />
                        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                            <DiscountsAndSurcharges
                                title="Descuentos"
                                actions="descuentos"
                                model="artículo"
                                entities={articleDiscounts}
                                setEntities={setArticleDiscounts}
                                open={open}
                            />
                            <DiscountsAndSurcharges
                                title="Recargos"
                                actions="recargos"
                                model="artículo"
                                entities={articleSurcharges}
                                setEntities={setArticleSurcharges}
                                open={open}
                            />
                        </Box>
                        <FormControl sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            justifyContent: 'center',
                            margin: '0 auto',
                            marginTop: 1,
                            width: '50%'
                        }}>
                            <Button type="button" variant="outlined" onClick={() => reset(setOpen)} sx={{ width: '50%' }}>
                                {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                            </Button>
                            {(open === 'NEW' || open === 'EDIT') &&
                                <Button
                                    type="button"
                                    variant="contained"
                                    disabled={disabled}
                                    sx={{ width: '50%' }}
                                    onClick={(e) => handleSubmit(e, validate, formData, reset, setDisabled)}
                                >
                                    Confirmar
                                </Button>
                            }
                        </FormControl>
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
            }
        </Layout>
    )
}