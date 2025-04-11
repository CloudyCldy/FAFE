import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import * as Yup from 'yup';
import api from '../services/api';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [values, setValues] = useState({
        full_name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validationSchema = Yup.object().shape({
        full_name: Yup.string().required('Nombre requerido'),
        email: Yup.string().email('Email inválido').required('Email requerido'),
        password: Yup.string().when([], {
            is: () => !id,
            then: Yup.string().required('Contraseña requerida'),
            otherwise: Yup.string(),
        }),
    });

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            api.get(`/users/${id}`).then((res) => {
                setValues({
                    full_name: res.data.full_name,
                    email: res.data.email,
                    password: '',
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(values, { abortEarly: false });
            setErrors({});
            if (isEdit) {
                await api.put(`/users/${id}`, values);
            } else {
                await api.post('/users', values);
            }
            navigate('/users');
        } catch (err) {
            if (err.name === 'ValidationError') {
                const formErrors = {};
                err.inner.forEach((error) => {
                    formErrors[error.path] = error.message;
                });
                setErrors(formErrors);
            } else {
                console.error('Error al guardar usuario:', err);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="full_name"
                        name="full_name"
                        label="Nombre Completo"
                        value={values.full_name}
                        onChange={handleChange}
                        error={!!errors.full_name}
                        helperText={errors.full_name}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="email"
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
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
