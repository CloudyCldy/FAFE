import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    const formik = useFormik({
        initialValues: {
            full_name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Nombre requerido'),
            email: Yup.string().email('Email inválido').required('Email requerido'),
            password: Yup.string().when([], {
                is: () => !id, // solo requerido si es nuevo
                then: Yup.string().required('Contraseña requerida'),
                otherwise: Yup.string(),
            }),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    await api.put(`/users/${id}`, values);
                } else {
                    await api.post('/users', values);
                }
                navigate('/users');
            } catch (error) {
                console.error('Error al guardar usuario:', error);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            api.get(`/users/${id}`).then((res) => {
                formik.setValues({
                    full_name: res.data.full_name,
                    email: res.data.email,
                    password: '',
                });
            });
        }
    }, [id]);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="full_name"
                        name="full_name"
                        label="Nombre Completo"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                        helperText={formik.touched.full_name && formik.errors.full_name}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        {isEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default UserForm;
