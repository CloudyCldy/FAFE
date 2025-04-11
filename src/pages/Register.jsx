import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { register } from '../services/auth'; // Importamos la función de registro
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
    const navigate = useNavigate(); // Usamos navigate para redirigir
    const [error, setError] = useState(''); // Estado para los errores

    // Configuración de Formik y Yup para validación
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email inválido').required('Requerido'),
            password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Requerido'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Requerido'),
        }),
        onSubmit: async (values) => {
            try {
                // Intentamos registrar al nuevo usuario
                await register(values.email, values.password);
                navigate('/login'); // Redirigimos a la página de login después del registro exitoso
            } catch (err) {
                setError('Error al registrar el usuario'); // Mostramos un mensaje de error
            }
        },
    });

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Crear cuenta
                </Typography>
                {error && <Typography color="error">{error}</Typography>} {/* Mostrar error */}
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirmar Contraseña"
                        type="password"
                        id="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Registrar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
