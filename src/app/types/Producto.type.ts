// src/types/productos.ts

import { Clientes } from "./Clientes.type";

export interface Productos {
    _id: string;
    nombre_producto: string;
    cantidad: number;
    precio: number;
    proveedor: string[]; // Ajusta según tus necesidades
    cliente: Clientes[]; // Ajusta según tus necesidades
    activo?: boolean; // Para saber si el producto está activo
}
