import { Proveedores } from "@/app/types/Proveedor.type";
const URL_BAC = `http://localhost:2000/api/proveedores`;

export const getProveedores = async () => {
    try {
        const respuesta = await fetch(`${URL_BAC}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud');
        }

        // Convertir la respuesta a JSON
        const data = await respuesta.json();
        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        return null; // Manejar el error y devolver null
    }
};

export const fetchPostProveedores = async (proveedor: Proveedores) =>{
    try {
        const respuesta = await fetch(`${URL_BAC}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(proveedor), // Enviar el proveedor en el cuerpo de la solicitud
        });

        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error('Error en la solicitud POST');
        }

        // Convertir la respuesta a JSON
        const data = await respuesta.json();
        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error('Error al crear el proveedor:', error);
        return null; // Manejar el error y devolver null
    }
}
