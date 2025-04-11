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
            password: '', // La contraseña se mantiene vacía para la edición
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Nombre requerido'),
            email: Yup.string().email('Email inválido').required('Email requerido'),
            password: Yup.string().when([], {
                is: !id, // Verifica si no hay un id, es decir, si es una creación de nuevo usuario
                then: Yup.string().required('Contraseña requerida'),
                otherwise: Yup.string().nullable(), // Contraseña no obligatoria en edición
            }),
        }),
        onSubmit: async (values) => {
            try {
                // Si estamos editando, eliminamos la contraseña vacía
                if (isEdit && !values.password) {
                    delete values.password;
                }

                // Si es una edición, se actualiza el usuario, si no, se crea uno nuevo
                if (isEdit) {
                    await api.put(`/users/${id}`, values); // Actualiza el usuario
                } else {
                    await api.post('/users', values); // Crea un nuevo usuario
                }
                navigate('/users'); // Redirige a la lista de usuarios
            } catch (error) {
                console.error('Error al guardar usuario:', error);
            }
        },
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            api.get(`/users/${id}`).then((res) => {
                // Verificar que los datos están correctamente obtenidos
                if (res.data) {
                    formik.setValues({
                        full_name: res.data.full_name,
                        email: res.data.email,
                        password: '', // Mantener la contraseña vacía
                    });
                }
            }).catch(error => {
                console.error('Error al obtener usuario:', error);
                // Puedes manejar algún mensaje de error aquí
            });
        }
    }, [id]); // Dependencia solo de `id` para evitar renderizados innecesarios

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
