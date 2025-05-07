/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Box, Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { AuthContext } from "../../providers/AuthProvider";

import { ArticleFilter } from "../filters/ArticleFilter";

export function ArtContentHeader({
    reset,
    setOpen,
    actPricesRef,
    setUploadedActFile,
    uploadedActFile,
    handleActPrices,
    newArticlesRef,
    uploadedNewFile,
    setUploadedNewFile,
    handleNewArticles,
    filter,
    setFilter
}) {

    const { auth } = useContext(AuthContext)

    return (
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
                            onChange={(e) => setUploadedActFile(e.target.files[0])}
                            accept=".xlsx, .xls"
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            color='success'
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {
                                if (uploadedActFile !== null) {
                                    handleActPrices()
                                } else {
                                    actPricesRef.current.click()
                                }
                            }}
                        >
                            {uploadedActFile !== null ? 'Subir' : 'Act. precios'}
                        </Button>
                        <input
                            type="file"
                            ref={newArticlesRef}
                            onChange={(e) => setUploadedNewFile(e.target.files[0])}
                            accept=".xlsx, .xls"
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            color='success'
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {
                                if (uploadedNewFile !== null) {
                                    handleNewArticles()
                                } else {
                                    newArticlesRef.current.click()
                                }
                            }}
                        >
                            {uploadedNewFile !== null ? 'Subir' : 'Alta art.'}
                        </Button>
                        {uploadedNewFile !== null &&
                            <Button
                                variant="outlined"
                                color='error'
                                size="small"
                                onClick={() => {
                                    newArticlesRef.current.value = null
                                    actPricesRef.current.value = null
                                    setUploadedNewFile(null)
                                }}
                            >
                                Cancelar
                            </Button>
                        }
                    </>
                }
            </Box>
            <ArticleFilter filter={filter} setFilter={setFilter} />
        </Box>
    )
}