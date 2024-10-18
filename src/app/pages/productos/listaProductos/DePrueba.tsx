'use client'

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Grid
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Info,
  Add,
} from "@mui/icons-material";

interface Producto {
  _id?: string;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  activo: boolean;
}

interface Proveedor {
  _id: string;
  nombre: string;
  // Añade más campos según sea necesario
}

interface Cliente {
  _id: string;
  nombre: string;
  // Añade más campos según sea necesario
}

const ProductosLista: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formValues, setFormValues] = useState<Producto>({
    nombre_producto: "",
    cantidad: 0,
    precio: 0,
    activo: true,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openAddProveedoresDialog, setOpenAddProveedoresDialog] = useState(false);
  const [openAddClientesDialog, setOpenAddClientesDialog] = useState(false);
  const [selectedProveedores, setSelectedProveedores] = useState<string[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [productoInfo, setProductoInfo] = useState<Producto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchProveedores();
    fetchClientes();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/productos");
      if (!response.ok) throw new Error('Error al obtener productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      handleError(error, "Error al cargar productos");
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/proveedores");
      if (!response.ok) throw new Error('Error al obtener proveedores');
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      handleError(error, "Error al cargar proveedores");
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/clientes");
      if (!response.ok) throw new Error('Error al obtener clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      handleError(error, "Error al cargar clientes");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateProducto = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear producto");
      }
      await fetchProductos();
      resetForm();
    } catch (error) {
      handleError(error, "Error al crear producto");
    }
  };

  const handleUpdateProducto = async () => {
    if (!selectedProducto?._id) return;
    try {
      const response = await fetch(`http://localhost:2000/api/productos/update/${selectedProducto._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar producto");
      }
      await fetchProductos();
      resetForm();
    } catch (error) {
      handleError(error, "Error al actualizar producto");
    }
  };

  const handleDeleteProducto = async () => {
    if (!selectedProducto?._id) return;
    try {
      const response = await fetch(`http://localhost:2000/api/productos/delete/${selectedProducto._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar producto");
      }
      await fetchProductos();
      handleCloseDeleteDialog();
    } catch (error) {
      handleError(error, "Error al eliminar producto");
    }
  };

  const handleEditClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setFormValues(producto);
  };

  const handleDeleteClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setOpenDeleteDialog(true);
  };

  const handleInfoClick = async (producto: Producto) => {
    setSelectedProducto(producto);
    try {
        const response = await fetch(`http://localhost:2000/api/productos/${producto._id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Asegúrate de que estos campos existan en la respuesta
        setProductoInfo({
            ...data, // Suponiendo que data ya contiene todos los campos necesarios
            proveedor: data.proveedor || [], // Asegúrate de que esto sea un array
            clientes: data.clientes || [],  // Asegúrate de que esto sea un array
        });

        setOpenInfoDialog(true); // Abre el diálogo para mostrar la información
    } catch (error) {
        console.error("Error al obtener la información del producto:", error);
        handleError(error, "Error al obtener la información del producto");
    }
};

  const handleAddProveedoresClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setOpenAddProveedoresDialog(true);
  };

  const handleAddClientesClick = (producto: Producto) => {
    setSelectedProducto(producto);
    setOpenAddClientesDialog(true);
  };

  const handleSaveProveedores = async () => {
    if (!selectedProducto?._id) return;
    try {
      for (const proveedorId of selectedProveedores) {
        await fetch(`http://localhost:2000/api/productos/${selectedProducto._id}/proveedores/${proveedorId}`, {
          method: "PATCH",
        });
      }
      await fetchProductos();
      setOpenAddProveedoresDialog(false);
    } catch (error) {
      handleError(error, "Error al asociar proveedores al producto");
    }
  };

  const handleSaveClientes = async () => {
    if (!selectedProducto?._id) return;
    try {
      for (const clienteId of selectedClientes) {
        await fetch(`http://localhost:2000/api/productos/${selectedProducto._id}/clientes/${clienteId}`, {
          method: "PATCH",
        });
      }
      await fetchProductos();
      setOpenAddClientesDialog(false);
    } catch (error) {
      handleError(error, "Error al asociar clientes al producto");
    }
  };

  const handleProveedorChange = (proveedorId: string) => {
    setSelectedProveedores(prev =>
      prev.includes(proveedorId)
        ? prev.filter(id => id !== proveedorId)
        : [...prev, proveedorId]
    );
  };

  const handleClienteChange = (clienteId: string) => {
    setSelectedClientes(prev =>
      prev.includes(clienteId)
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProducto(null);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setProductoInfo(null);
  };

  const handleCloseAddProveedoresDialog = () => {
    setOpenAddProveedoresDialog(false);
    setSelectedProveedores([]);
  };

  const handleCloseAddClientesDialog = () => {
    setOpenAddClientesDialog(false);
    setSelectedClientes([]);
  };

  const resetForm = () => {
    setSelectedProducto(null);
    setFormValues({
      nombre_producto: "",
      cantidad: 0,
      precio: 0,
      activo: true,
    });
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    let errorMessage = defaultMessage;
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    setErrorMessage(errorMessage);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      <form onSubmit={(e) => {
        e.preventDefault();
        selectedProducto ? handleUpdateProducto() : handleCreateProducto();
      }}>
        <TextField
          fullWidth
          margin="normal"
          name="nombre_producto"
          label="Nombre del Producto"
          value={formValues.nombre_producto}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="cantidad"
          label="Cantidad"
          type="number"
          value={formValues.cantidad}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="precio"
          label="Precio"
          type="number"
          value={formValues.precio}
          onChange={handleInputChange}
        />
        <Box display="flex" alignItems="center" marginY={2}>
          <Switch
            name="activo"
            checked={formValues.activo}
            onChange={handleInputChange}
          />
          <Typography>Producto Activo</Typography>
        </Box>
        <Button type="submit" variant="contained" color="primary">
          {selectedProducto ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto.nombre_producto}</TableCell>
                <TableCell>{producto.cantidad}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(producto)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(producto)} color="secondary">
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleInfoClick(producto)} color="info">
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleAddProveedoresClick(producto)} color="primary">
                    <Add />
                  </IconButton>
                  <IconButton onClick={() => handleAddClientesClick(producto)} color="primary">
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirmar eliminación"}</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el producto {selectedProducto?.nombre_producto}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteProducto} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Información del Producto */}
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
        <DialogTitle>{"Información del Producto"}</DialogTitle>
        <DialogContent>
          {productoInfo && (
            <>
              <Typography><strong>Nombre:</strong> {productoInfo.nombre_producto}</Typography>
              <Typography><strong>Cantidad:</strong> {productoInfo.cantidad}</Typography>
              <Typography><strong>Precio:</strong> {productoInfo.precio}</Typography>
              <Typography><strong>Estado:</strong> {productoInfo.activo ? "Activo" : "Inactivo"}</Typography>
              {/* Aquí puedes añadir más información si es necesario */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Agregar Proveedores */}
      <Dialog open={openAddProveedoresDialog} onClose={handleCloseAddProveedoresDialog}>
    <DialogTitle>{"Agregar Proveedores al Producto"}</DialogTitle>
    <DialogContent>
        <Grid container spacing={2}>
            {proveedores.map((proveedor) => (
                <Grid item xs={12} sm={6} key={proveedor._id}>
                    <Paper elevation={1} style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                        <Checkbox checked={selectedProveedores.includes(proveedor._id)} onChange={() => handleProveedorChange(proveedor._id)} />
                        <Typography>{proveedor.nombre}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseAddProveedoresDialog}>Cancelar</Button>
        <Button onClick={handleSaveProveedores} color="primary">
            Guardar
        </Button>
    </DialogActions>
</Dialog>

      {/* Modal para Agregar Clientes */}
      <Dialog open={openAddClientesDialog} onClose={handleCloseAddClientesDialog}>
        <DialogTitle>{"Agregar Clientes al Producto"}</DialogTitle>
        <DialogContent>
          <List>
            {clientes.map((cliente) => (
              <ListItem key={cliente._id} button onClick={() => handleClienteChange(cliente._id)}>
                <Checkbox checked={selectedClientes.includes(cliente._id)} />
                <ListItemText primary={cliente.nombre} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddClientesDialog}>Cancelar</Button>
          <Button onClick={handleSaveClientes} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de error */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductosLista;