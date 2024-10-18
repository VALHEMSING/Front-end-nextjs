import ProductosComponent from "./listaProductos/ListaProductos";
import ProductosLista from "./listaProductos/DePrueba";

export default function ProductosPage() {
  // Aquí puedes definir un productoId para pasar al componente
 

  return (
    <div>
      
      {/* Renderiza el componente de gestión de proveedores y clientes */}
      <ProductosLista  />
    </div>
  );
}
