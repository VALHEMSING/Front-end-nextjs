'use client';
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
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";

// Estilos (mantenidos del componente ProveedorLista)
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
  },
  width: "100%",
  marginBottom: theme.spacing(3),
  borderRadius: "20px",
  backgroundColor: "#f9f9f9",
  padding: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    width: "75%",
    margin: "auto",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5),
  fontSize: "0.875rem",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: "10px",
  transition: "background-color 0.3s ease",
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

const ProductoLista = () => {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    activo: true,
  });
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionType, setActionType] = useState('create');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:2000/api/productos');
      if (!respuesta.ok) throw new Error('Error al obtener todos los productos');
      const data = await respuesta.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener los productos: ', error);
      setErrorMessage('Error al obtener los productos');
      setOpenSnackbar(true);
    }
  };

  const handleOpenModal = (producto: any) => {
    setSelectedProducto(producto);
    if (producto) {
      setFormValues({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        activo: producto.activo,
      });
      setActionType('update');
    } else {
      setFormValues({
        nombre: "",
        descripcion: "",
        precio: "",
        activo: true,
      });
      setActionType('create');
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProducto(null);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSaveProducto = async () => {
    try {
      let url;
      let method;
      if (actionType === 'create') {
        url = 'http://localhost:2000/api/productos';
        method = 'POST';
      } else if (actionType === 'update') {
        url = `http://localhost:2000/api/productos/update/${selectedProducto?._id}`;
        method = 'PUT';
      }
      const response = await fetch(`${url}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formValues, precio: parseFloat(formValues.precio)}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }
      fetchProductos();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setErrorMessage("Error al guardar el producto");
      setOpenSnackbar(true);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await fetch(`http://localhost:2000/api/productos/active/${id}`, { method: 'PUT' });
      fetchProductos();
    } catch (error) {
      console.error("Error al activar el producto:", error);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await fetch(`http://localhost:2000/api/productos/deactive/${id}`, { method: 'PUT' });
      fetchProductos();
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:2000/api/productos/delete/${id}`, { method: 'DELETE' });
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "100px" }}>
      <section style={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        padding: "20px",
        borderRadius: "10px",
        color: "#fff"
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          style={{ marginBottom: "30px" }}
        >
          Crear Producto
        </Button>
        <Grid container spacing={4}>
          {productos.map((producto:any) => (
            <Grid item xs={12} md={6} key={producto._id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Descripción: {producto.descripcion}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Precio: ${producto.precio.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    style={{ 
                      color: producto.activo ? "#4caf50" : "#f44336",
                      fontWeight: "bold",
                      marginBottom: "10px"
                    }}
                  >
                    {producto.activo ? "Activo" : "Desactivado"}
                  </Typography>
                  {producto.proveedores && producto.proveedores.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <Typography variant="body2">Proveedores:</Typography>
                      {producto.proveedores.map((proveedor) => (
                        <Chip 
                          key={proveedor._id} 
                          label={proveedor.nombre_proveedor} 
                          size="small" 
                          style={{ margin: "2px" }}
                        />
                      ))}
                    </div>
                  )}
                  {producto.clientes && producto.clientes.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <Typography variant="body2">Clientes:</Typography>
                      {producto.clientes.map((cliente) => (
                        <Chip 
                          key={cliente._id} 
                          label={cliente.nombre_cliente} 
                          size="small" 
                          style={{ margin: "2px" }}
                        />
                      ))}
                    </div>
                  )}
                  <UpdateButton onClick={() => handleOpenModal(producto)}>
                    Actualizar
                  </UpdateButton>
                  {producto.activo ? (
                    <DeactivateButton onClick={() => handleDeactivate(producto._id)}>
                      Desactivar
                    </DeactivateButton>
                  ) : (
                    <ActivateButton onClick={() => handleActivate(producto._id)}>
                      Activar
                    </ActivateButton>
                  )}
                  <DeleteButton onClick={() => handleDelete(producto._id)}>
                    Eliminar
                  </DeleteButton>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </section>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{actionType === 'create' ? "Crear Producto" : "Actualizar Producto"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={formValues.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio"
            name="precio"
            type="number"
            value={formValues.precio}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
          <Button onClick={handleSaveProducto} color="primary">
            {actionType === 'create' ? "Crear" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={errorMessage ? "error" : "success"} onClose={handleCloseSnackbar}>
          {errorMessage || "Operación exitosa"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductoLista;