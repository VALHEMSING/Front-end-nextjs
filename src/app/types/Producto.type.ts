// src/types/productos.ts

export interface Productos {
    _id: string;
    nombre_producto: string;
    cantidad: number;
    precio: number;
    proveedor: string[]; // Ajusta según tus necesidades
    cliente: string[]; // Ajusta según tus necesidades
    activo?: boolean; // Para saber si el producto está activo
}
