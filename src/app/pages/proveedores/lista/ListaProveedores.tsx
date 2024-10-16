'use client'
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

// Definir estilos personalizados para los botones de acción
const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  fontSize: "0.875rem",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: "8px",
}));

const ActivateButton = styled(ActionButton)({
  backgroundColor: "#4caf50",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#388e3c",
  },
});

const DeactivateButton = styled(ActionButton)({
  backgroundColor: "#ff9800",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#f57c00",
  },
});

const DeleteButton = styled(ActionButton)({
  backgroundColor: "#f44336",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#d32f2f",
  },
});

const UpdateButton = styled(ActionButton)({
  backgroundColor: "#2196f3",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1976d2",
  },
});

const ProveedorLista = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre_proveedor: "",
    email_proveedor: "",
    celular_proveedor: "",
    activo_proveedor: true, 
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionType, setActionType] = useState<'create' | 'update'>('create');

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const respuesta = await fetch('http://localhost:2000/api/proveedores');
      if (!respuesta.ok) throw new Error('Error al obtener todos los proveedores');
      const data = await respuesta.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al obtener los proveedores: ', error);
      setErrorMessage('Error al obtener los proveedores');
      setOpenSnackbar(true);
    }
  };

  const handleCardClick = (proveedor: any) => {
    setSelectedProveedor(proveedor);
    setFormValues({
      nombre_proveedor: proveedor.nombre_proveedor,
      email_proveedor: proveedor.email_proveedor,
      celular_proveedor: proveedor.celular_proveedor,
      activo_proveedor: proveedor.activo_proveedor,
    });
    setActionType('update');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProveedor(null);
    setFormValues({
      nombre_proveedor: "",
      email_proveedor: "",
      celular_proveedor: "",
      activo_proveedor: true, 
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleRegisterAndEnroll = async () => {
    try {
      let url;
      let method;

      if (actionType === 'create') {
        url = 'http://localhost:2000/api/proveedores';
        method = 'POST';
        
      } else if (actionType === 'update') {
        url = `http://localhost:2000/api/proveedores/update/${selectedProveedor._id}`;
        method = 'PUT';
      }

      const response = await fetch(`${url}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar o actualizar el proveedor');
      }

      setOpenSnackbar(true);
      handleCloseModal();
      fetchProveedores();
    } catch (error) {
      console.error("Error al registrar o actualizar un proveedor:", error);
      setErrorMessage("Error al registrar o actualizar el proveedor");
      setOpenSnackbar(true);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await fetch(`http://localhost:2000/api/proveedores/active/${id}`, { method: 'PUT' });
      fetchProveedores();
    } catch (error) {
      console.error("Error al activar el proveedor:", error);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:2000/api/proveedores/deactive/${id}`, { method: 'PUT' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al desactivar el proveedor');
      }
      
      fetchProveedores();
    } catch (error) {
      console.error("Error al desactivar el proveedor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:2000/api/proveedores/delete/${id}`, { method: 'DELETE' });
      fetchProveedores();
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Container sx={{ 
      zIndex: 20, 
      background: 'linear-gradient(to right, #6a11cb, #2575fc)',
      marginTop:'100px',
      padding: '20px', 
      borderRadius: '8px' 
    }}>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => { 
          setActionType('create'); 
          setOpenModal(true); 
        }}
        sx={{ marginBottom: '20px' }}
      >
        Crear Proveedor
      </Button>

      <Grid container spacing={5}>
        {proveedores.map((proveedor: any) => (
          <Grid item xs={12} sm={6} md={3} key={proveedor._id}>
            <Card 
              sx={{ 
                transition: '0.8s', 
                '&:hover': { transform: 'scale(1.05)' },
                backgroundColor: '#f0f0f0',
                padding: '20px',
                boxShadow: 3,
                minHeight: '250px',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {proveedor.nombre_proveedor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {proveedor.email_proveedor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {proveedor.celular_proveedor}
                </Typography>
                <Typography variant="body2" color={proveedor.activo_proveedor ? "green" : "red"}>
                  Estado: {proveedor.activo_proveedor ? "Activo" : "Inactivo"}
                </Typography>
                
                <UpdateButton onClick={() => handleCardClick(proveedor)}>Actualizar</UpdateButton>
                <DeactivateButton onClick={() => handleDeactivate(proveedor._id)}>Desactivar</DeactivateButton>
                <ActivateButton onClick={() => handleActivate(proveedor._id)}>Activar</ActivateButton>
                <DeleteButton onClick={() => handleDelete(proveedor._id)}>Eliminar</DeleteButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para registrar/editar proveedores */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{actionType === 'update' ? "Actualizar Proveedor" : "Registrar Proveedor"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            name="nombre_proveedor"
            value={formValues.nombre_proveedor}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email_proveedor"
            value={formValues.email_proveedor}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Celular"
            name="celular_proveedor"
            value={formValues.celular_proveedor}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleRegisterAndEnroll}>{actionType === 'update' ? "Actualizar" : "Registrar"}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={errorMessage ? "error" : "success"} onClose={handleCloseSnackbar}>
          {errorMessage || "Operación exitosa"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProveedorLista;
