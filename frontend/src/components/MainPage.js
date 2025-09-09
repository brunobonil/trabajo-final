import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Importamos los componentes de react-bootstrap que vamos a usar
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';

// Importamos un ícono para hacer la UI más atractiva
import { Cart4 } from 'react-bootstrap-icons';

import '../App.css'; // Asegúrate de que este archivo contiene los estilos mejorados

const API = process.env.REACT_APP_BACKEND_API;

export const MainPage = () => {
  const { idSuper } = useParams();
  const navigate = useNavigate(); // 1. Usamos el hook useNavigate para la navegación SPA

  const [nombreSuper, setNombreSuper] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 2. Añadimos un estado de carga

  useEffect(() => {
    // Definimos la función dentro del useEffect para evitar advertencias
    const fetchNombreSupermercado = async () => {
      try {
        const res = await fetch(`${API}/supermercado/${idSuper}`);
        if (!res.ok) {
          throw new Error('No se pudo encontrar el supermercado.');
        }
        const data = await res.json();
        setNombreSuper(data.nombre);
      } catch (error) {
        console.error(error);
        setNombreSuper('un supermercado no identificado'); // Manejo de error básico
      } finally {
        setIsLoading(false); // La carga termina, ya sea con éxito o error
      }
    };

    fetchNombreSupermercado();
  }, [idSuper]); // Agregamos idSuper como dependencia

  const crearCarrito = async () => {
    // Podríamos añadir un estado de "creando carrito" aquí también
    try {
      const res = await fetch(`${API}/carrito/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supermercado: idSuper }),
      });
      const data = await res.json();
      // 3. Navegamos sin recargar la página
      navigate(`/${idSuper}/carrito/${data.id}`);
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      // Aquí podrías mostrar una alerta al usuario
    }
  };

  // 4. Mostramos un Spinner mientras se cargan los datos
  if (isLoading) {
    return (
      <Container as="main" className="main-page-container vh-100">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Cargando...</p>
      </Container>
    );
  }

  // 5. El JSX es ahora mucho más limpio, semántico y usa react-bootstrap
  return (
    <Container as="main" className="main-page-container text-center">
      {/* Usamos Stack para manejar el espaciado vertical fácilmente */}
      <Stack gap={3} className="align-items-center">
        <Cart4 color="var(--primary-color)" size={80} />

        <h1>¡Bienvenido a tu asistente de compras!</h1>
        
        <h2>Usted se encuentra en <span style={{fontWeight: 'bold'}}>{nombreSuper}</span></h2>
        
        <Button
          variant="danger" // Usa los estilos predefinidos de Bootstrap (rojo)
          size="lg"
          className="main-action-btn" // Mantenemos nuestra clase para estilos extra (sombra, etc.)
          onClick={crearCarrito}
        >
          CREAR CARRITO
        </Button>
      </Stack>
    </Container>
  );
};

export default MainPage;