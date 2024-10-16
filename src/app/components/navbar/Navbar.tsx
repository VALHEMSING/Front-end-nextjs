'use client';
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";
import Link from "next/link";

// Estilos personalizados para los elementos del sidebar
const SidebarContainer = styled(Box)({
  width: 250,
  backgroundColor: "#1e1e2f", // Color del sidebar
  height: "100vh", // Altura completa del viewport
  color: "#fff",
  padding: "20px",
  transition: "all 0.3s ease-in-out",
});

const SidebarHeader = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "1rem",
  color: "#ffc107", // Color del encabezado
});

const SidebarItem = styled(ListItem)({
  padding: "15px 10px",
  margin: "10px 0",
  borderRadius: "5px",
  "&:hover": {
    backgroundColor: "#ffc107", // Color al pasar el ratón
    color: "#1e1e2f",
    transition: "all 0.3s ease-in-out",
  },
});

const SidebarDivider = styled(Divider)({
  backgroundColor: "#ffc107", // Color del divisor
  margin: "10px 0",
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }
    setIsOpen(open);
  };

  const sidebarContent = (
    <SidebarContainer role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <SidebarHeader variant="h6">Navegación</SidebarHeader>
      <List>
        <SidebarItem >
          <Link href="/pages/home/" passHref>
            <ListItemText primary="Home" />
          </Link>
        </SidebarItem>
        <SidebarItem >
          <Link href="/pages/proveedores" passHref>
            <ListItemText primary="Proveedores" />
          </Link>
        </SidebarItem>
        <SidebarItem >
          <Link href="/about" passHref>
            <ListItemText primary="About" />
          </Link>
        </SidebarItem>
      </List>
      <SidebarDivider />
      <Typography variant="caption" sx={{ textAlign: "center", display: "block", marginTop: "1rem" }}>
        Sistema de Gestión © 2024
      </Typography>
    </SidebarContainer>
  );

  return (
    <>
      {/* Botón para abrir el sidebar */}
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ position: "absolute", top: 16, left: 16 }}>
        <MenuIcon sx={{ color: "#ffc107" }} />
      </IconButton>

      {/* Sidebar */}
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Navbar;
