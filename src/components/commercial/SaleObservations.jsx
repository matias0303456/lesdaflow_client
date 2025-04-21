/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material"

export function SaleObservations({
    formData,
    handleChange,
    errors,
    handleClose,
    disabled,
    handleSubmit,
    validate,
    reset,
    setDisabled,
    open
}) {
    return (
        <Box sx={{ p: 1 }}>
            <textarea
                style={{
                    width: '100%',
                    height: 300,
                    border: '1px solid #C4C4C4',
                    padding: 10,
                    borderRadius: 5,
                    resize: 'none'
                }}
                disabled={open === 'VIEW'}
                id="observations"
                name="observations"
                placeholder="Observaciones..."
                value={formData.observations}
                onChange={handleChange}
            ></textarea>
            {errors.observations?.type === 'maxLength' &&
                <Typography variant="caption" color="red" marginTop={1}>
                    * Las observaciones son demasiado largas.
                </Typography>
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                justifyContent: 'center',
                margin: '0 auto',
                marginTop: 3,
                width: '50%'
            }}>
                <Button type="button" variant="outlined" onClick={handleClose} sx={{ width: '50%' }}>
                    {open === 'VIEW' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {(open === 'NEW' || open === 'CONVERT' || open === 'EDIT') &&
                    <Button
                        type="button"
                        variant="contained"
                        disabled={disabled}
                        sx={{ width: '50%' }}
                        onClick={e => handleSubmit(e, formData, validate, reset, setDisabled)}
                    >
                        Guardar
                    </Button>
                }
            </Box>
        </Box>
    )
}