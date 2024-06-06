import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

import { Layout } from "../components/common/Layout";

export function ChangePassword() {

    const { changePassword } = useAuth()
    const { formData, handleChange, errors, validate } = useForm({
        defaultData: { current_password: '', new_password: '', repeat_new_password: '' },
        rules: {
            current_password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            new_password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            repeat_new_password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
        }
    })

    const handleSubmit = async e => {
        e.preventDefault()
        if (validate() && (formData.new_password === formData.repeat_new_password)) {
            changePassword(formData)
        }
    }

    return (
        <Layout title="Cambiar contraseña">
            <Box sx={{ width: { xs: '100%', sm: '40%' } }} className="mb-3 bg-white rounded-md">
                <Typography
                    variant="h6"
                    sx={{
                        width: "100%",
                        fontSize: "14px",
                        color: "white",
                        backgroundColor: "#078BCD",
                        padding: 1,
                        borderRadius: "2px",
                        fontWeight: "bold",
                    }}
                >
                    Cambiar contraseña
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "10px", paddingLeft: 1, paddingTop: 1 }}>
                    Deberás iniciar sesión nuevamente
                </Typography>
                <form onChange={handleChange} onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            justifyContent: "start",
                            padding: 1,
                            paddingBottom: 2,
                            gap: 1
                        }}
                    >
                        <FormControl
                            variant="standard"
                            sx={{
                                width: "100%",
                                color: "#59656b",
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "center"
                            }}
                        >
                            <InputLabel htmlFor="id" className="text-gray-400">
                                Contraseña actual
                            </InputLabel>
                            <Input
                                className="w-full"
                                type="password"
                                name="current_password"
                                value={formData.current_password}
                            />
                            {errors.current_password?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña actual es requerida.
                                </Typography>
                            }
                            {errors.current_password?.type === 'minLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña actual es demasiado corta.
                                </Typography>
                            }
                            {errors.current_password?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña actual es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl
                            variant="standard"
                            sx={{
                                width: "100%",
                                color: "#59656b",
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "center",
                                marginTop: 1,
                                marginBottom: 1
                            }}
                        >
                            <InputLabel htmlFor="percentage" className="text-gray-400">
                                Nueva contraseña
                            </InputLabel>
                            <Input
                                className="w-full"
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                            />
                            {errors.new_password?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La nueva contraseña es requerida.
                                </Typography>
                            }
                            {errors.new_password?.type === 'minLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La nueva contraseña es demasiado corta.
                                </Typography>
                            }
                            {errors.new_password?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La nueva contraseña es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl
                            variant="standard"
                            sx={{
                                width: "100%",
                                color: "#59656b",
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "center"
                            }}
                        >
                            <InputLabel htmlFor="percentage" className="text-gray-400">
                                Repetir nueva contraseña
                            </InputLabel>
                            <Input
                                className="w-full"
                                type="password"
                                name="repeat_new_password"
                                value={formData.repeat_new_password}
                            />
                            {formData.new_password !== formData.repeat_new_password &&
                                (formData.new_password.length > 0 || formData.repeat_new_password.length > 0) &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * Las contraseñas no coinciden.
                                </Typography>
                            }
                        </FormControl>
                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'start', width: '100%' }}>
                            <Button type="submit" variant="contained">
                                Confirmar
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Layout>
    )
}